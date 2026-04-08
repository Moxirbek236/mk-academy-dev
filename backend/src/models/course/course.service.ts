import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';
import { CreateCourseDto, QueryCourseDto, UpdateCourseDto } from './dto';
import { Prisma } from '@prisma/client';
@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) { }
  async createCourse(payload: CreateCourseDto) {
    const existTitle = await this.prisma.course.findFirst({
      where: {
        title: payload.title
      }
    })
    if (existTitle) throw new ConflictException("Course title is already in use")
    const data = await this.prisma.course.create({
      data: {
        title: payload.title,
        imageUrl: payload.imageUrl,
        level: payload.level,
        isActive: payload.isActive,
        description: payload.description
      }
    })
    return {
      status: 200,
      success: true,
      message: "Course is successfully created !"
    }
  }
  async deleteCourseById(id: number) {
    const existCourse = await this.prisma.course.findUnique({
      where: { id }
    })
    if (!existCourse) throw new NotFoundException("Course is not found !")

    const data = await this.prisma.course.update({
      where: {
        id
      },
      data: {
        isActive: false
      }
    })

    return {
      status: 200,
      message: "Course is successfully  deleted"
    }
  }
  async getAllCourses(query: QueryCourseDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.level) {
      where.level = query.level;
    }

    if (query.search) {
      where.title = { contains: query.search, mode: 'insensitive' };
    }

    // Mana bu qism doim ishlaydi, search bo‘lsa ham, bo‘lmasa ham
    const [data, total] = await Promise.all([
      this.prisma.course.findMany({
        skip,
        take: limit,
        where,
        select: {
          id: true,
          imageUrl: true,
          title: true,
          level: true,
          createdAt: true,
          isActive: true,
          description: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.course.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    };
  }
  async getOneCourseById(id: number) {
    const existCourse = await this.prisma.course.findUnique({
      where: { id },
      select: {
        id: true,
        imageUrl: true,
        title: true,
        level: true,
        createdAt: true,
        isActive: true,
        description: true
      }
    })
    if (!existCourse) throw new NotFoundException("Course is not found !")

    return {
      status: 200,
      success: true,
      data: existCourse
    }

  }


  async updateCourse(id: number, payload: UpdateCourseDto) {
    try {
      const data = await this.prisma.course.update({
        where: { id },
        data: payload,
      });
      return {
        status: 200,
        success: true,
        message: "Course is updated"
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {

        if (error.code === 'P2025') {
          throw new NotFoundException('Course not found');
        }

        if (error.code === 'P2002') {
          throw new BadRequestException('Title already exists');
        }
      }

      throw error;
    }
  }
}
