import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';
import { CreateTestDto, UpdateTestDto } from './dto';

@Injectable()
export class TestService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTestDto) {
    return (this.prisma.test as any).create({ data: dto as any });
  }

  async findAll() {
    return (this.prisma.test as any).findMany({ include: { questions: true } });
  }

  async findOne(id: number) {
    return (this.prisma.test as any).findUnique({ where: { id: +id }, include: { questions: true } });
  }

  async update(id: number, dto: UpdateTestDto) {
    return (this.prisma.test as any).update({ where: { id: +id }, data: dto as any });
  }

  async remove(id: number) {
    return (this.prisma.test as any).delete({ where: { id: +id } });
  }
}
