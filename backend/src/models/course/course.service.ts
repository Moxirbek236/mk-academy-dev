import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from './dto';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCourseDto) {
    return (this.prisma.course as any).create({ data: dto as any });
  }

  async findAll() {
    return (this.prisma.course as any).findMany({
      where: { isActive: true },
      include: { tests: true, tasks: true }
    });
  }

  async findOne(id: number) {
    return (this.prisma.course as any).findUnique({ 
      where: { id: +id }, 
      include: { tests: true, tasks: true } 
    });
  }

  async update(id: number, dto: UpdateCourseDto) {
    return (this.prisma.course as any).update({ 
      where: { id: +id }, 
      data: dto as any 
    });
  }

  async remove(id: number) {
    return (this.prisma.course as any).delete({ where: { id: +id } });
  }
}
