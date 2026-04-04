import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(teacherId?: string) {
    return this.prisma.task.findMany({
      where: teacherId ? { createdById: teacherId } : {},
      include: {
        _count: { select: { studentTasks: true } },
        course: { select: { title: true } }
      }
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.task.findUnique({
      where: { id },
      include: { course: true, attachments: true }
    });
    if (!item) throw new NotFoundException('Topshiriq topilmadi');
    return item;
  }

  async create(data: any) {
    return this.prisma.task.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.task.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.task.delete({ where: { id } });
  }
}
