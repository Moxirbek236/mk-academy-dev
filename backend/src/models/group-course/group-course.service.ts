import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateGroupCourseDto } from './dto/create-group-course.dto';
import { UpdateGroupCourseDto } from './dto/update-group-course.dto';
import { QueryGroupCourseDto } from './dto/query-group-course.dto';
import { PrismaService } from 'src/core/config/prisma.service';

@Injectable()
export class GroupCourseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGroupCourseDto) {
    const { groupId, courseId } = dto;

    const group = await this.prisma.group.findFirst({
      where: { id: groupId, isActive: true },
    });
    if (!group) throw new NotFoundException('Group topilmadi');

    const course = await this.prisma.course.findFirst({
      where: { id: courseId, isActive: true },
    });
    if (!course) throw new NotFoundException('Course topilmadi');

    const exists = await this.prisma.groupCourse.findUnique({
      where: { groupId_courseId: { groupId, courseId } },
    });
    if (exists) {
      throw new ConflictException('Bu course allaqachon groupga biriktirilgan');
    }

    return this.prisma.groupCourse.create({
      data: { groupId, courseId },
      include: {
        group: true,
        course: true,
      },
    });
  }

  // ─── FIND ALL (pagination + filter) ─────────────────────────────────────────
  async findAll(query: QueryGroupCourseDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: {
      isActive?: boolean;
      groupId?: number;
      courseId?: number;
    } = {};

    if (query.isActive !== undefined) where.isActive = query.isActive;
    if (query.groupId) where.groupId = query.groupId;
    if (query.courseId) where.courseId = query.courseId;

    // agar filter berilmasa default: isActive = true
    if (Object.keys(where).length === 0) where.isActive = true;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.groupCourse.findMany({
        where,
        skip,
        take: limit,
        include: {
          group: true,
          course: true,
        },
        orderBy: { id: 'desc' },
      }),
      this.prisma.groupCourse.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ─── FIND ONE ────────────────────────────────────────────────────────────────
  async findOne(id: number) {
    const data = await this.prisma.groupCourse.findFirst({
      where: { id, isActive: true },
      include: {
        group: true,
        course: true,
      },
    });

    if (!data) throw new NotFoundException('GroupCourse topilmadi');

    return data;
  }

  // ─── UPDATE ──────────────────────────────────────────────────────────────────
  async update(id: number, dto: UpdateGroupCourseDto) {
    const existing = await this.prisma.groupCourse.findUnique({
      where: { id },
    });

    if (!existing || !existing.isActive) {
      throw new NotFoundException('GroupCourse topilmadi');
    }

    if (dto.groupId || dto.courseId) {
      const groupId = dto.groupId ?? existing.groupId;
      const courseId = dto.courseId ?? existing.courseId;

      const duplicate = await this.prisma.groupCourse.findUnique({
        where: { groupId_courseId: { groupId, courseId } },
      });

      if (duplicate && duplicate.id !== id) {
        throw new ConflictException('Bunday bog\'lanish allaqachon mavjud');
      }

      if (dto.groupId) {
        const group = await this.prisma.group.findFirst({
          where: { id: dto.groupId, isActive: true },
        });
        if (!group) throw new NotFoundException('Group topilmadi');
      }

      if (dto.courseId) {
        const course = await this.prisma.course.findFirst({
          where: { id: dto.courseId, isActive: true },
        });
        if (!course) throw new NotFoundException('Course topilmadi');
      }
    }

    return this.prisma.groupCourse.update({
      where: { id },
      data: dto,
      include: {
        group: true,
        course: true,
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.groupCourse.findUnique({
      where: { id },
    });

    if (!existing || !existing.isActive) {
      throw new NotFoundException('GroupCourse topilmadi yoki allaqachon o\'chirilgan');
    }

    return this.prisma.groupCourse.update({
      where: { id },
      data: { isActive: false },
      include: {
        group: true,
        course: true,
      },
    });
  }
}