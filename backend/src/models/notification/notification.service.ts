import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationType, UserRole } from 'src/core/enums';

type CurrentUser = {
  id: number;
  role: string;
};

type GeneratedNotification = {
  type: NotificationType;
  title: string;
  body: string;
  dedupeKey: string;
  data?: Record<string, unknown>;
};

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  private normalizeRole(role?: string | null) {
    return String(role || '').toUpperCase();
  }

  private serializeData(data?: Record<string, unknown>) {
    if (!data) return undefined;
    return JSON.stringify(data);
  }

  private parseData(data?: string | null) {
    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch {
      return { raw: data };
    }
  }

  private extractDedupeKey(data?: string | null) {
    const parsed = this.parseData(data);
    return typeof parsed?.dedupeKey === 'string' ? parsed.dedupeKey : null;
  }

  private async ensureOwnership(notificationId: number, currentUser: CurrentUser) {
    const notification = await (this.prisma.notification as any).findUnique({
      where: { id: +notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (
      notification.userId !== currentUser.id &&
      this.normalizeRole(currentUser.role) !== UserRole.SUPERADMIN
    ) {
      throw new ForbiddenException("Siz bu bildirishnomaga kira olmaysiz");
    }

    return notification;
  }

  private async getGeneratedNotifications(currentUser: CurrentUser) {
    const role = this.normalizeRole(currentUser.role);

    if (role === UserRole.SUPERADMIN) {
      return this.getSuperadminNotifications(currentUser);
    }

    if (role === UserRole.ADMIN) {
      return this.getAdminNotifications();
    }

    if (role === UserRole.TEACHER) {
      return this.getTeacherNotifications(currentUser);
    }

    return this.getStudentNotifications(currentUser);
  }

  private async getSuperadminNotifications(currentUser: CurrentUser) {
    const [recentUsers, recentLeads, recentTransactions, latestSystemStats] =
      await Promise.all([
        this.prisma.user.findMany({
          where: {
            isActive: true,
            createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            fullName: true,
            role: true,
            createdAt: true,
          },
        }),
        this.prisma.lead.findMany({
          where: {
            isActive: true,
            createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            fullName: true,
            status: true,
          },
        }),
        this.prisma.financeTransaction.findMany({
          where: {
            isActive: true,
            createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            amount: true,
            type: true,
            user: {
              select: {
                fullName: true,
              },
            },
          },
        }),
        this.prisma.systemStats.findFirst({
          orderBy: { updatedAt: 'desc' },
        }),
      ]);

    const items: GeneratedNotification[] = [
      ...recentUsers.map((user) => ({
        type: NotificationType.SYSTEM,
        title: 'Audit log: new user created',
        body: `${user.fullName} (${user.role}) platformaga qo'shildi.`,
        dedupeKey: `superadmin-audit-user-${user.id}`,
        data: {
          route: '/system',
          role: user.role,
          entityId: user.id,
        },
      })),
      ...recentLeads.map((lead) => ({
        type: NotificationType.SYSTEM,
        title: 'Audit log: new lead created',
        body: `${lead.fullName} yangi murojaat qoldirdi. Status: ${lead.status}.`,
        dedupeKey: `superadmin-audit-lead-${lead.id}`,
        data: {
          route: '/system',
          leadId: lead.id,
        },
      })),
      ...recentTransactions.map((transaction) => ({
        type: NotificationType.SYSTEM,
        title: 'Audit log: finance event',
        body: `${transaction.type} ${transaction.amount} UZS${transaction.user?.fullName ? ` - ${transaction.user.fullName}` : ''}.`,
        dedupeKey: `superadmin-audit-finance-${transaction.id}`,
        data: {
          route: '/system',
          transactionId: transaction.id,
        },
      })),
    ];

    if (
      latestSystemStats &&
      (latestSystemStats.cpuUsage >= 80 ||
        latestSystemStats.network >= 300 ||
        latestSystemStats.uptimePerc < 99)
    ) {
      items.unshift({
        type: NotificationType.SYSTEM,
        title: 'System monitoring warning',
        body: `CPU ${latestSystemStats.cpuUsage}% | Network ${latestSystemStats.network}ms | Uptime ${latestSystemStats.uptimePerc}%`,
        dedupeKey: `superadmin-system-warning-${latestSystemStats.updatedAt.toISOString()}`,
        data: {
          route: '/system',
          userId: currentUser.id,
        },
      });
    }

    return items;
  }

  private async getAdminNotifications() {
    const leads = await this.prisma.lead.findMany({
      where: {
        isActive: true,
        status: 'NEW',
        createdAt: { gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        fullName: true,
        phone: true,
      },
    });

    return leads.map<GeneratedNotification>((lead) => ({
      type: NotificationType.GENERAL,
      title: 'Yangi lead keldi',
      body: `${lead.fullName} (${lead.phone}) bilan bog'lanish kerak.`,
      dedupeKey: `admin-lead-${lead.id}`,
      data: {
        route: '/leads',
        leadId: lead.id,
      },
    }));
  }

  private async getTeacherNotifications(currentUser: CurrentUser) {
    const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const [examAssignments, recentMembers] = await Promise.all([
      this.prisma.groupAssignment.findMany({
        where: {
          isActive: true,
          testId: { not: null },
          group: {
            teacherId: currentUser.id,
            isActive: true,
          },
          OR: [
            { dueDate: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
            { dueDate: null, createdAt: { gte: since } },
          ],
        },
        orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
        take: 10,
        include: {
          group: {
            select: {
              id: true,
              name: true,
            },
          },
          test: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      }),
      this.prisma.groupMember.findMany({
        where: {
          isActive: true,
          joinedAt: { gte: since },
          group: {
            teacherId: currentUser.id,
            isActive: true,
          },
        },
        orderBy: { joinedAt: 'desc' },
        take: 10,
        include: {
          group: {
            select: {
              id: true,
              name: true,
            },
          },
          student: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
      }),
    ]);

    return [
      ...examAssignments.map<GeneratedNotification>((assignment) => ({
        type: NotificationType.ASSIGNMENT,
        title: 'Exam eslatmasi',
        body: assignment.dueDate
          ? `${assignment.group.name} uchun "${assignment.test?.title}" imtihoni ${new Date(assignment.dueDate).toLocaleDateString('en-GB')} da boshlanadi.`
          : `${assignment.group.name} uchun "${assignment.test?.title}" imtihoni tayyor.`,
        dedupeKey: `teacher-exam-${assignment.id}`,
        data: {
          route: '/results',
          assignmentId: assignment.id,
          groupId: assignment.group.id,
          testId: assignment.test?.id,
        },
      })),
      ...recentMembers.map<GeneratedNotification>((member) => ({
        type: NotificationType.GENERAL,
        title: "Guruhga yangi o'quvchi qo'shildi",
        body: `${member.student.fullName} ${member.group.name} guruhiga qo'shildi.`,
        dedupeKey: `teacher-group-member-${member.groupId}-${member.studentId}`,
        data: {
          route: '/groups',
          groupId: member.groupId,
          studentId: member.studentId,
        },
      })),
    ];
  }

  private async getStudentNotifications(currentUser: CurrentUser) {
    const examAssignments = await this.prisma.groupAssignment.findMany({
      where: {
        isActive: true,
        testId: { not: null },
        group: {
          isActive: true,
          members: {
            some: {
              studentId: currentUser.id,
              isActive: true,
            },
          },
        },
        OR: [
          { dueDate: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
          { dueDate: null, createdAt: { gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) } },
        ],
      },
      orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
      take: 10,
      include: {
        group: {
          select: {
            id: true,
            name: true,
          },
        },
        test: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    const attemptedTests = await this.prisma.testAttempt.findMany({
      where: {
        studentId: currentUser.id,
        testId: {
          in: examAssignments
            .map((assignment) => assignment.testId)
            .filter((testId): testId is number => typeof testId === 'number'),
        },
      },
      select: {
        testId: true,
        submittedAt: true,
      },
    });

    const submittedTestIds = new Set(
      attemptedTests
        .filter((attempt) => Boolean(attempt.submittedAt))
        .map((attempt) => attempt.testId),
    );

    return examAssignments
      .filter((assignment) => assignment.testId && !submittedTestIds.has(assignment.testId))
      .map<GeneratedNotification>((assignment) => ({
        type: NotificationType.ASSIGNMENT,
        title: 'Imtihon eslatmasi',
        body: assignment.dueDate
          ? `"${assignment.test?.title}" imtihoni ${new Date(assignment.dueDate).toLocaleDateString('en-GB')} kuni.`
          : `"${assignment.test?.title}" imtihoni sizni kutmoqda.`,
        dedupeKey: `student-exam-${assignment.id}`,
        data: {
          route: '/results',
          assignmentId: assignment.id,
          groupId: assignment.group.id,
          testId: assignment.test?.id,
        },
      }));
  }

  private async ensureGeneratedNotifications(currentUser: CurrentUser) {
    const generated = await this.getGeneratedNotifications(currentUser);

    if (!generated.length) {
      return;
    }

    const existingNotifications = await (this.prisma.notification as any).findMany({
      where: {
        userId: currentUser.id,
        isActive: true,
      },
      select: {
        data: true,
      },
    });

    const existingKeys = new Set(
      existingNotifications
        .map((notification: { data?: string | null }) => this.extractDedupeKey(notification.data))
        .filter((value: string | null): value is string => Boolean(value)),
    );

    for (const item of generated) {
      if (existingKeys.has(item.dedupeKey)) {
        continue;
      }

      await (this.prisma.notification as any).create({
        data: {
          userId: currentUser.id,
          type: item.type,
          title: item.title,
          body: item.body,
          data: this.serializeData({
            ...item.data,
            dedupeKey: item.dedupeKey,
          }),
        } as any,
      });

      existingKeys.add(item.dedupeKey);
    }
  }

  async create(dto: CreateNotificationDto) {
    return (this.prisma.notification as any).create({ data: dto as any });
  }

  async findFeedForCurrentUser(currentUser: CurrentUser) {
    await this.ensureGeneratedNotifications(currentUser);

    const notifications = await (this.prisma.notification as any).findMany({
      where: {
        userId: currentUser.id,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 40,
    });

    return {
      success: true,
      data: {
        items: notifications.map((notification: any) => ({
          ...notification,
          data: this.parseData(notification.data),
        })),
        unreadCount: notifications.filter((notification: any) => !notification.isRead).length,
      },
    };
  }

  async findAllByUser(userId: number, currentUser: CurrentUser) {
    if (
      +userId !== currentUser.id &&
      this.normalizeRole(currentUser.role) !== UserRole.SUPERADMIN
    ) {
      throw new ForbiddenException("Siz boshqa foydalanuvchi bildirishnomasini ko'ra olmaysiz");
    }

    return (this.prisma.notification as any).findMany({
      where: { userId: +userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: number, currentUser: CurrentUser) {
    await this.ensureOwnership(id, currentUser);

    return (this.prisma.notification as any).update({
      where: { id: +id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(currentUser: CurrentUser) {
    await (this.prisma.notification as any).updateMany({
      where: {
        userId: currentUser.id,
        isRead: false,
        isActive: true,
      },
      data: {
        isRead: true,
      },
    });

    return this.findFeedForCurrentUser(currentUser);
  }

  async remove(id: number, currentUser: CurrentUser) {
    await this.ensureOwnership(id, currentUser);

    return (this.prisma.notification as any).update({
      where: { id: +id },
      data: { isActive: false },
    });
  }
}
