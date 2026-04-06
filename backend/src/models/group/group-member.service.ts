import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';

@Injectable()
export class GroupMemberService {
  constructor(private prisma: PrismaService) {}

  async addMember(groupId: number, studentId: number) {
    return (this.prisma.groupMember as any).create({
      data: { groupId: +groupId, studentId: +studentId, role: 'STUDENT', status: 'ACTIVE' } as any
    });
  }

  async removeMember(groupId: number, studentId: number) {
    return (this.prisma.groupMember as any).delete({
      where: { groupId_studentId: { groupId: +groupId, studentId: +studentId } }
    });
  }

  async findMembers(groupId: number) {
    return (this.prisma.groupMember as any).findMany({
      where: { groupId: +groupId },
      include: { student: true }
    });
  }
}
