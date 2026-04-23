import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';

@Injectable()
export class GroupCourseService {
  constructor(private prisma: PrismaService) {}

  async assignCourse(groupId: number, courseId: number) {
    const existing = await this.prisma.groupCourse.findUnique({
      where: { groupId_courseId: { groupId, courseId } },
    });

    if (existing?.isActive) {
      throw new ConflictException('Bu course allaqachon groupga biriktirilgan');
    }

    if (existing) {
      return this.prisma.groupCourse.update({
        where: { id: existing.id },
        data: { isActive: true, assignedAt: new Date() },
        include: { group: true, course: true },
      });
    }

    return this.prisma.groupCourse.create({
      data: { groupId, courseId },
      include: { group: true, course: true },
    });
  }

  async removeCourse(id: number) {
    const existing = await this.prisma.groupCourse.findUnique({
      where: { id },
    });
    if (!existing || !existing.isActive) {
      throw new NotFoundException(
        "GroupCourse topilmadi yoki allaqachon o'chirilgan",
      );
    }
    return this.prisma.groupCourse.update({
      where: { id },
      data: { isActive: false },
      include: { group: true, course: true },
    });
  }

  async findByGroup(groupId: number) {
    return this.prisma.groupCourse.findMany({
      where: { groupId, isActive: true },
      include: { course: true },
      orderBy: { id: 'desc' },
    });
  }

  async findByCourse(courseId: number) {
    return this.prisma.groupCourse.findMany({
      where: { courseId, isActive: true },
      include: { group: true },
      orderBy: { id: 'desc' },
    });
  }
}
