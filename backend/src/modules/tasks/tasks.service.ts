import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.task.findMany();
  }

  async findOne(id: string) {
    const item = await this.prisma.task.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Topilmadi');
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
