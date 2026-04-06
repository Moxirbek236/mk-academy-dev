import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTaskDto) {
    return (this.prisma.task as any).create({ data: dto as any });
  }

  async findAll() {
    return (this.prisma.task as any).findMany();
  }

  async findOne(id: number) {
    return (this.prisma.task as any).findUnique({ where: { id: +id } });
  }

  async update(id: number, dto: UpdateTaskDto) {
    return (this.prisma.task as any).update({ where: { id: +id }, data: dto as any });
  }

  async remove(id: number) {
    return (this.prisma.task as any).delete({ where: { id: +id } });
  }
}
