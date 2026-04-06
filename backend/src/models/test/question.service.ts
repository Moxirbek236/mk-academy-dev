import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  async create(testId: number, data: any) {
    return (this.prisma.question as any).create({ data: { ...data, testId: +testId } as any });
  }

  async findAllByTest(testId: number) {
    return (this.prisma.question as any).findMany({ where: { testId: +testId } });
  }

  async update(id: number, data: any) {
    return (this.prisma.question as any).update({ where: { id: +id }, data });
  }

  async remove(id: number) {
    return (this.prisma.question as any).delete({ where: { id: +id } });
  }
}
