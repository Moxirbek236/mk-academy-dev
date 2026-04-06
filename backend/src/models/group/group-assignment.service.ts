import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';

@Injectable()
export class GroupAssignmentService {
  constructor(private prisma: PrismaService) {}

  async assign(groupId: number, taskId?: number, testId?: number) {
    const assignment = await (this.prisma.groupAssignment as any).create({
      data: { groupId: +groupId, taskId: taskId ? +taskId : null, testId: testId ? +testId : null } as any
    });

    const members = await (this.prisma.groupMember as any).findMany({ where: { groupId: +groupId } });
    
    if (taskId) {
      await (this.prisma.studentTask as any).createMany({
        data: members.map(m => ({
          studentId: m.studentId,
          taskId: +taskId,
          status: 'PENDING'
        })) as any
      });
    }

    return assignment;
  }

  async findByGroup(groupId: number) {
    return (this.prisma.groupAssignment as any).findMany({ where: { groupId: +groupId } });
  }
}
