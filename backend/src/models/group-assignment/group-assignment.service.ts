import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';
import { CreateGroupAssignmentDto, UpdateGroupAssignmentDto } from './dto';
import { UserRole } from 'src/core/enums';

@Injectable()
export class GroupAssignmentService {
  constructor(private prisma: PrismaService) {}

  // ─── Helper: SUPERADMIN yoki ADMIN ekanligini tekshirish ───────────────────
  private isAdminOrSuperAdmin(role: string): boolean {
    return role === UserRole.SUPERADMIN || role === UserRole.ADMIN;
  }

  // ─── Helper: Guruhni topish va tekshirish ──────────────────────────────────
  private async getActiveGroup(groupId: number) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });
    if (!group) throw new NotFoundException('Guruh topilmadi');
    if (!group.isActive)
      throw new BadRequestException('Bu guruh faol emas');
    return group;
  }

  // ─── Helper: Teacher faqat o'z guruhiga kirishi mumkinligini tekshirish ────
  private checkTeacherGroupOwnership(
    teacherId: number,
    currentUserId: number,
  ) {
    if (teacherId !== currentUserId) {
      throw new ForbiddenException(
        "Siz faqat o'z guruhingizga tegishli vazifalarni boshqara olasiz",
      );
    }
  }

  // ─── Helper: Student o'z guruhiga a'zo ekanligini tekshirish ───────────────
  private async checkStudentGroupMembership(
    groupId: number,
    studentId: number,
  ) {
    const membership = await this.prisma.groupMember.findFirst({
      where: { groupId, studentId, isActive: true },
    });
    if (!membership) {
      throw new ForbiddenException(
        "Bu vazifa siz a'zo bo'lgan guruhga tegishli emas",
      );
    }
  }

  // ─── Helper: Task mavjudligini tekshirish ─────────────────────────────────
  private async getActiveTask(taskId: number) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Vazifa (task) topilmadi');
    if (!task.isActive)
      throw new BadRequestException('Bu vazifa (task) faol emas');
    return task;
  }

  // ─── Helper: Test mavjudligini tekshirish ─────────────────────────────────
  private async getActiveTest(testId: number) {
    const test = await this.prisma.test.findUnique({ where: { id: testId } });
    if (!test) throw new NotFoundException('Test topilmadi');
    if (!test.isActive)
      throw new BadRequestException('Bu test faol emas');
    return test;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CREATE
  // Ruxsatlar: SUPERADMIN, ADMIN — hamma guruhga; TEACHER — faqat o'z guruhiga
  // ═══════════════════════════════════════════════════════════════════════════
  async create(dto: CreateGroupAssignmentDto, currentUser: any) {
    // Kamida bitta (task yoki test) berilishi shart
    if (!dto.taskId && !dto.testId) {
      throw new BadRequestException(
        "Kamida bitta vazifa (taskId) yoki test (testId) kiritilishi shart",
      );
    }

    // Ikkalasi birga berilmasligi kerak
    if (dto.taskId && dto.testId) {
      throw new BadRequestException(
        "Bir vaqtda faqat bitta: taskId YOKI testId kiritilishi mumkin",
      );
    }

    const group = await this.getActiveGroup(dto.groupId);

    // Teacher faqat o'z guruhiga yaratishi mumkin
    if (currentUser.role === UserRole.TEACHER) {
      this.checkTeacherGroupOwnership(group.teacherId, currentUser.id);
    }

    // Task mavjud va faolligini tekshirish
    if (dto.taskId) {
      await this.getActiveTask(dto.taskId);
    }

    // Test mavjud va faolligini tekshirish
    if (dto.testId) {
      await this.getActiveTest(dto.testId);
    }

    await this.prisma.groupAssignment.create({
      data: {
        groupId: dto.groupId,
        taskId: dto.taskId ?? null,
        testId: dto.testId ?? null,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        isRequired: dto.isRequired ?? true,
      },
    });

    return {
      success: true,
      message: 'Guruh vazifasi muvaffaqiyatli yaratildi',
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FIND ALL
  // Ruxsatlar:
  //   SUPERADMIN, ADMIN → barcha aktiv vazifalar (groupName filter bilan)
  //   TEACHER           → faqat o'z guruhlaridagi vazifalar
  //   STUDENT           → faqat o'zi a'zo bo'lgan guruhlardagi vazifalar
  // ═══════════════════════════════════════════════════════════════════════════
  async findAll(groupName: string | undefined, currentUser: any) {
    const where: any = { isActive: true };

    if (this.isAdminOrSuperAdmin(currentUser.role)) {
      // Admin/Superadmin — barcha aktiv vazifalar, kerak bo'lsa guruh nomi bo'yicha filter
      if (groupName) {
        where.group = { name: { contains: groupName } };
      }
    } else if (currentUser.role === UserRole.TEACHER) {
      // Teacher — faqat o'z guruhlaridagi vazifalar
      where.group = {
        teacherId: currentUser.id,
        isActive: true,
        ...(groupName ? { name: { contains: groupName } } : {}),
      };
    } else if (currentUser.role === UserRole.STUDENT) {
      // Student — faqat o'zi a'zo bo'lgan, aktiv guruhlardagi vazifalar
      where.group = {
        isActive: true,
        ...(groupName ? { name: { contains: groupName } } : {}),
        members: {
          some: { studentId: currentUser.id, isActive: true },
        },
      };
    }

    const assignments = await this.prisma.groupAssignment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        group: {
          select: { id: true, name: true, teacherId: true },
        },
        task: {
          select: {
            id: true,
            title: true,
            type: true,
            maxScore: true,
            isActive: true,
          },
        },
        test: {
          select: {
            id: true,
            title: true,
            type: true,
            passingScore: true,
            isActive: true,
          },
        },
      },
    });

    return {
      success: true,
      total: assignments.length,
      data: assignments,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FIND ONE
  // Ruxsatlar:
  //   SUPERADMIN, ADMIN → istalgan vazifani ko'ra oladi
  //   TEACHER           → faqat o'z guruhidagi vazifani ko'ra oladi
  //   STUDENT           → faqat o'zi a'zo bo'lgan guruhdagi vazifani ko'ra oladi
  // ═══════════════════════════════════════════════════════════════════════════
  async findOne(id: number, currentUser: any) {
    const assignment = await this.prisma.groupAssignment.findUnique({
      where: { id },
      include: {
        group: {
          select: { id: true, name: true, teacherId: true, isActive: true },
        },
        task: {
          select: {
            id: true,
            title: true,
            description: true,
            type: true,
            instructions: true,
            maxScore: true,
            isActive: true,
          },
        },
        test: {
          select: {
            id: true,
            title: true,
            description: true,
            type: true,
            timeLimitMinutes: true,
            passingScore: true,
            shuffleQuestions: true,
            isActive: true,
          },
        },
      },
    });

    if (!assignment) throw new NotFoundException('Guruh vazifasi topilmadi');
    if (!assignment.isActive)
      throw new BadRequestException('Bu guruh vazifasi faol emas');
    if (!assignment.group.isActive)
      throw new BadRequestException('Bu guruh faol emas');

    // Teacher — faqat o'z guruhidagi vazifani ko'ra oladi
    if (currentUser.role === UserRole.TEACHER) {
      this.checkTeacherGroupOwnership(
        assignment.group.teacherId,
        currentUser.id,
      );
    }

    // Student — faqat o'zi a'zo bo'lgan guruhdagi vazifani ko'ra oladi
    if (currentUser.role === UserRole.STUDENT) {
      await this.checkStudentGroupMembership(
        assignment.groupId,
        currentUser.id,
      );
    }

    return {
      success: true,
      data: assignment,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UPDATE
  // Ruxsatlar: SUPERADMIN, ADMIN → istalgan; TEACHER → faqat o'z guruhidagi
  // ═══════════════════════════════════════════════════════════════════════════
  async update(id: number, dto: UpdateGroupAssignmentDto, currentUser: any) {
    // Ikkala (taskId va testId) birga berilmasligi kerak
    if (dto.taskId && dto.testId) {
      throw new BadRequestException(
        "Bir vaqtda faqat bitta: taskId YOKI testId kiritilishi mumkin",
      );
    }

    const assignment = await this.prisma.groupAssignment.findUnique({
      where: { id },
      include: {
        group: { select: { id: true, teacherId: true, isActive: true } },
      },
    });

    if (!assignment) throw new NotFoundException('Guruh vazifasi topilmadi');
    if (!assignment.isActive)
      throw new BadRequestException('Bu guruh vazifasi faol emas');

    // Teacher faqat o'z guruhidagi vazifalarni tahrirlashi mumkin
    if (currentUser.role === UserRole.TEACHER) {
      this.checkTeacherGroupOwnership(
        assignment.group.teacherId,
        currentUser.id,
      );
    }

    // Yangi groupId berilgan bo'lsa uning mavjudligini tekshirish
    if (dto.groupId && dto.groupId !== assignment.groupId) {
      const newGroup = await this.getActiveGroup(dto.groupId);
      // Teacher yangi guruh ham o'ziniki ekanligini tekshiradi
      if (currentUser.role === UserRole.TEACHER) {
        this.checkTeacherGroupOwnership(newGroup.teacherId, currentUser.id);
      }
    }

    // Yangi taskId berilgan bo'lsa tekshirish
    if (dto.taskId) {
      await this.getActiveTask(dto.taskId);
    }

    // Yangi testId berilgan bo'lsa tekshirish
    if (dto.testId) {
      await this.getActiveTest(dto.testId);
    }

    // dueDate ni to'g'ri parse qilish (null ham qabul qilinadi — muddatni olib tashlash)
    const updateData: any = {};
    if (dto.groupId !== undefined) updateData.groupId = dto.groupId;
    if (dto.taskId !== undefined) updateData.taskId = dto.taskId;
    if (dto.testId !== undefined) updateData.testId = dto.testId;
    if (dto.isRequired !== undefined) updateData.isRequired = dto.isRequired;
    if (dto.dueDate !== undefined) {
      updateData.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    }

    await this.prisma.groupAssignment.update({
      where: { id },
      data: updateData,
    });

    return {
      success: true,
      message: 'Guruh vazifasi muvaffaqiyatli tahrirlandi',
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // REMOVE (soft delete — isActive: false)
  // Ruxsatlar: SUPERADMIN, ADMIN → istalgan; TEACHER → faqat o'z guruhidagi
  // ═══════════════════════════════════════════════════════════════════════════
  async remove(id: number, currentUser: any) {
    const assignment = await this.prisma.groupAssignment.findUnique({
      where: { id },
      include: {
        group: { select: { id: true, teacherId: true } },
      },
    });

    if (!assignment) throw new NotFoundException('Guruh vazifasi topilmadi');
    if (!assignment.isActive)
      throw new BadRequestException("Bu guruh vazifasi allaqachon o'chirilgan");

    // Teacher faqat o'z guruhidagi vazifalarni o'chirishi mumkin
    if (currentUser.role === UserRole.TEACHER) {
      this.checkTeacherGroupOwnership(
        assignment.group.teacherId,
        currentUser.id,
      );
    }

    await this.prisma.groupAssignment.update({
      where: { id },
      data: { isActive: false },
    });

    return {
      success: true,
      message: "Guruh vazifasi muvaffaqiyatli o'chirildi",
    };
  }
}
