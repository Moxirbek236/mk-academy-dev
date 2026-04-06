import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';

@Injectable()
export class GroupCourseService {
  constructor(private prisma: PrismaService) {}

  async assignCourse(groupId: number, courseId: number) {
    return (this.prisma.groupCourse as any).create({
      data: { groupId: +groupId, courseId: +courseId } as any
    });
  }

  async removeCourse(groupId: number, courseId: number) {
    return (this.prisma.groupCourse as any).delete({
      where: { groupId_courseId: { groupId: +groupId, courseId: +courseId } }
    });
  }

  async findByGroup(groupId: number) {
    return (this.prisma.groupCourse as any).findMany({
      where: { groupId: +groupId },
      include: { course: true }
    });
  }
}
