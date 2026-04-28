import { Injectable, NotFoundException } from '@nestjs/common';
import { Course } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCourseDto): Promise<Course> {
    return this.prisma.course.create({
      data: {
        title: dto.title,
        description: dto.description,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async findAll(): Promise<Course[]> {
    return this.prisma.course.findMany({
      orderBy: [{ isActive: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findActive(): Promise<Course[]> {
    return this.prisma.course.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: number, dto: UpdateCourseDto): Promise<Course> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!course) {
      throw new NotFoundException('Kurs topilmadi');
    }

    return this.prisma.course.update({
      where: { id },
      data: dto,
    });
  }
}
