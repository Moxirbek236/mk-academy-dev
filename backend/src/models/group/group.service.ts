import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';
import { CreateGroupDto, UpdateGroupDto } from './dto';
import { UserRole } from 'src/core/enums';

type CurrentUser = {
  id: number;
  role: UserRole | string;
};

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService) { }

  private normalizeRole(role: string | UserRole) {
    const normalized = String(role || '').toUpperCase();

    if (normalized === UserRole.SUPERADMIN) return UserRole.SUPERADMIN;
    if (normalized === UserRole.ADMIN) return UserRole.ADMIN;
    if (normalized === UserRole.TEACHER) return UserRole.TEACHER;

    return UserRole.STUDENT;
  }

  private buildScopedWhere(currentUser: CurrentUser, name?: string) {
    const role = this.normalizeRole(currentUser.role);
    const trimmedName = name?.trim();

    if (role === UserRole.SUPERADMIN || role === UserRole.ADMIN) {
      return {
        isActive: true,
        name: trimmedName ? { contains: trimmedName } : undefined,
      };
    }

    if (role === UserRole.TEACHER) {
      return {
        isActive: true,
        teacherId: currentUser.id,
        name: trimmedName ? { contains: trimmedName } : undefined,
      };
    }

    return {
      isActive: true,
      name: trimmedName ? { contains: trimmedName } : undefined,
      members: {
        some: {
          studentId: currentUser.id,
          isActive: true,
        },
      },
    };
  }

  private async findScopedGroupOrThrow(id: number, currentUser: CurrentUser) {
    const group = await this.prisma.group.findFirst({
      where: {
        id,
        ...this.buildScopedWhere(currentUser),
      },
      include: {
        teacher: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        members: {
          where: { isActive: true },
          include: {
            student: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            courses: true,
            assignments: true,
          },
        },
      },
    });

    if (!group) {
      throw new NotFoundException('Siz uchun mavjud bunday guruh topilmadi');
    }

    return group;
  }

  async create(currentUser: CurrentUser, payload: CreateGroupDto) {
    const role = this.normalizeRole(currentUser.role);

    if (role === UserRole.TEACHER && payload.teacherId !== currentUser.id) {
      throw new ForbiddenException(
        'Teacher faqat o\'ziga tegishli guruh yaratishi mumkin',
      );
    }

    //check teacher is exists
    const checkTeacherId = await this.prisma.user.findFirst({ where: { id: payload.teacherId, isActive: true, role: "TEACHER" } });
    if (!checkTeacherId) {
      throw new NotFoundException('Bunday o\'qituvchi mavjud emas');
    }

    //check unique invite code
    const checkUniqueInviteCode = await this.prisma.group.findFirst({ where: { inviteCode: payload.inviteCode } });
    if (checkUniqueInviteCode) {
      throw new BadRequestException('Bunday taklif kodi allaqachon mavjud');
    }
    const group = await this.prisma.group.create({
      data: {
        name: payload.name,
        description: payload?.description,
        teacherId: payload.teacherId,
        inviteCode: payload.inviteCode
      }
    });
    return {
      message: "Guruh muvaffaqiyatli yaratildi",
      data: group
    }
  }

  async findAll(currentUser: CurrentUser, name?: string) {
    return await this.prisma.group.findMany({
      where: this.buildScopedWhere(currentUser, name),
      include: {
        teacher: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            members: true,
            courses: true,
            assignments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, currentUser: CurrentUser) {
    return this.findScopedGroupOrThrow(id, currentUser);
  }

  async update(id: number, currentUser: CurrentUser, dto: UpdateGroupDto) {
    const role = this.normalizeRole(currentUser.role);
    const group = await this.findScopedGroupOrThrow(id, currentUser);

    if (
      role === UserRole.TEACHER &&
      dto.teacherId !== undefined &&
      dto.teacherId !== currentUser.id
    ) {
      throw new ForbiddenException(
        'Teacher guruhni boshqa o\'qituvchiga o\'tkaza olmaydi',
      );
    }

    if (dto.teacherId && dto.teacherId !== group.teacherId) {
      const checkTeacherId = await this.prisma.user.findFirst({
        where: { id: dto.teacherId, isActive: true, role: 'TEACHER' },
      });

      if (!checkTeacherId) {
        throw new NotFoundException('Bunday o\'qituvchi mavjud emas');
      }
    }

    if (dto.inviteCode && dto.inviteCode !== group.inviteCode) {
      const existingInviteCode = await this.prisma.group.findFirst({
        where: {
          inviteCode: dto.inviteCode,
          id: { not: id },
        },
      });

      if (existingInviteCode) {
        throw new BadRequestException(
          'Bunday taklif kodi allaqachon mavjud',
        );
      }
    }

    return this.prisma.group.update({ where: { id }, data: dto as any });
  }

  async remove(id: number, currentUser: CurrentUser) {
    const group = await this.findScopedGroupOrThrow(id, currentUser);

    if (!group.isActive) {
      throw new BadRequestException('Bu guruh allaqachon o\'chirilgan');
    }
    return this.prisma.group.update({
      where: { id },
      data: { isActive: false }
    });
  }
}
