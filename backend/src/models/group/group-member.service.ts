import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';
import { Status, UserRole } from 'src/core/enums';

@Injectable()
export class GroupMemberService {
  constructor(private prisma: PrismaService) { }

  async addMember(groupId: number, studentId: number) {

    const checkgroupId = await this.prisma.group.findUnique({
      where: { id: +groupId, isActive: true }
    });
    if (!checkgroupId) {
      throw new NotFoundException('Bunday group topilmadi');
    }

    const checkStudentId = await this.prisma.user.findUnique({ where: { id: +studentId, isActive: true, role: UserRole.STUDENT } });
    if (!checkStudentId) {
      throw new NotFoundException('Bunday student topilmadi');
    }

    const createdMember = await this.prisma.groupMember.create({
      data: { groupId: +groupId, studentId: +studentId, },
      select: {
        id: true,
        groupId: true,
        studentId: true,
        status: true,
        student: {
          select: {
            id: true,
            fullName: true,
          }
        },
        group: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });
    return {
      message: "Student guruhga qo'shildi",
      data: createdMember
    }
  }

  async removeMember(groupId: number, studentId: number) {
    const checkgroupId = await this.prisma.group.findUnique({
      where: { id: +groupId, isActive: true }
    });
    if (!checkgroupId) {
      throw new NotFoundException('Bunday group topilmadi');
    }

    const checkStudentId = await this.prisma.user.findUnique({ where: { id: +studentId, isActive: true, role: UserRole.STUDENT } });
    if (!checkStudentId) {
      throw new NotFoundException('Bunday student topilmadi');
    }

    const removedMember = await this.prisma.groupMember.update({
      where: { groupId_studentId: { groupId: +groupId, studentId: +studentId } },
      data: { status: Status.INACTIVE, isActive: false },
    });
    return {
      message: "Student guruhdan olib tashlandi",
      data: removedMember
    };
  }

  async findMembers(groupId: number) {
    const group = await this.prisma.group.findUnique({ where: { id: +groupId } });
    if (!group) throw new NotFoundException('Bunday guruh topilmadi');

    return this.prisma.groupMember.findMany({
      where: { groupId: +groupId, isActive: true },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            avatarUrl: true,
            cefrLevel: true,
            role: true,
          }
        }
      },
      orderBy: { joinedAt: 'asc' }
    });
  }
}
