import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';
import { XPService } from '../gamification/xp.service';

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
    return (this.prisma.testAttempt as any).findMany({ where: { studentId: +studentId } });
  }
}
