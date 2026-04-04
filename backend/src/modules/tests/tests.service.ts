import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.test.findMany();
  }

  async findOne(id: string) {
    const item = await this.prisma.test.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Topilmadi');
    return item;
  }

  async findAttemptsByStudent(studentId: string) {
    return this.prisma.testAttempt.findMany({
      where: { studentId },
      include: { test: { select: { title: true } } },
      orderBy: { startedAt: 'desc' },
      take: 20
    });
  }

  async create(data: any) {
    return this.prisma.test.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.test.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.test.delete({ where: { id } });
  }
}
