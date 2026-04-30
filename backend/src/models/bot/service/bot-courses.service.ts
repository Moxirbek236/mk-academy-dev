import { Injectable, NotFoundException } from '@nestjs/common';
import { BotCourse } from '@prisma/client';
import { PrismaService } from '../../../core/config/prisma.service';
import { CreateCourseDto } from './dto/courses-dto/create-course.dto';
import { UpdateCourseDto } from './dto/courses-dto/update-course.dto';

@Injectable()
export class BotCoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCourseDto): Promise<BotCourse> {
    return this.prisma.botCourse.create({
      data: {
        title: dto.title,
        description: dto.description,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async findAll(): Promise<BotCourse[]> {
    return this.prisma.botCourse.findMany({
      orderBy: [{ isActive: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findActive(): Promise<BotCourse[]> {
    return this.prisma.botCourse.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: number, dto: UpdateCourseDto): Promise<BotCourse> {
    const course = await this.prisma.botCourse.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!course) {
      throw new NotFoundException('Kurs topilmadi');
    }

    return this.prisma.botCourse.update({
      where: { id },
      data: dto,
    });
  }
}

