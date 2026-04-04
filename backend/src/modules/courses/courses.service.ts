import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.course.findMany({
      include: {
        _count: { select: { tasks: true, tests: true, groups: true } }
      }
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.course.findUnique({
      where: { id },
      include: { tasks: true, tests: true }
    });
    if (!item) throw new NotFoundException('Kurs topilmadi');
    return item;
  }

  async findMyLearning(studentId: string) {
    // Studentning guruhlaridan kelib chiqib kurslarni olish
    return this.prisma.course.findMany({
      where: {
        groups: {
          some: {
            group: {
              members: {
                some: { studentId }
              }
            }
          }
        }
      },
      include: {
        _count: { select: { tasks: true, tests: true } }
      }
    });
  }

  async create(data: any) {
    return this.prisma.course.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.course.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.course.delete({ where: { id } });
  }
}
