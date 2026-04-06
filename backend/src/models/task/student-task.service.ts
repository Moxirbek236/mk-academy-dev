import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';

@Injectable()
export class StudentTaskService {
  constructor(private prisma: PrismaService) {}

  async submitTask(studentId: number, taskId: number, submissionUrl: string) {
    return (this.prisma.studentTask as any).update({
      where: { studentId_taskId: { studentId: +studentId, taskId: +taskId } },
      data: { submissionUrl, status: 'SUBMITTED', submittedAt: new Date() }
    });
  }

  async findByStudent(studentId: number) {
    return (this.prisma.studentTask as any).findMany({
      where: { studentId: +studentId },
      include: { task: true }
    });
  }
}
