import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';
import { XPService } from '../gamification/xp.service';
import { UserRole } from 'src/core/enums';

@Injectable()
export class TestAttemptService {
  constructor(
    private prisma: PrismaService,
    private xpService: XPService
  ) {}

  async submitAttempt(studentId: number, testId: number, score: number, passed: boolean) {
    const attempt = await (this.prisma.testAttempt as any).create({
      data: { studentId: +studentId, testId: +testId, score, passed, submittedAt: new Date() } as any
    });

    if (passed) {
      await this.xpService.addXP(+studentId, 100, `Passed test ${testId}`);
    }

    return attempt;
  }

  async findByStudent(studentId: number) {
    return (this.prisma.testAttempt as any).findMany({
      where: { studentId: +studentId },
      include: {
        test: {
          select: {
            id: true,
            title: true,
            type: true,
            passingScore: true,
          },
        },
      },
      orderBy: { startedAt: 'desc' },
    });
  }

  async findForCurrentUser(currentUser: { id: number; role: string }) {
    const role = String(currentUser.role || '').toUpperCase();

    if (role === UserRole.SUPERADMIN || role === UserRole.ADMIN) {
      return (this.prisma.testAttempt as any).findMany({
        include: {
          test: {
            select: {
              id: true,
              title: true,
              type: true,
              passingScore: true,
            },
          },
          student: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
        orderBy: { startedAt: 'desc' },
        take: 50,
      });
    }

    if (role === UserRole.TEACHER) {
      return (this.prisma.testAttempt as any).findMany({
        where: {
          test: {
            assignments: {
              some: {
                isActive: true,
                group: {
                  teacherId: currentUser.id,
                  isActive: true,
                },
              },
            },
          },
        },
        include: {
          test: {
            select: {
              id: true,
              title: true,
              type: true,
              passingScore: true,
            },
          },
          student: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
        orderBy: { startedAt: 'desc' },
        take: 50,
      });
    }

    return this.findByStudent(currentUser.id);
  }
}
