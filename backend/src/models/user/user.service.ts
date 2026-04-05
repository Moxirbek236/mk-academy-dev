import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        ...dto,
        role: dto.role || 'STUDENT',
        profile: {
          create: {} // Automatically create an empty profile
        },
        leaderboards: {
          create: { score: 0, scope: 'GLOBAL' } // Initialize global leaderboard entry
        }
      } as any,
      include: { profile: true, leaderboards: true }
    });
  }

  async findAll() {
    return this.prisma.user.findMany({ include: { profile: true } });
  }

  async findOne(id: number) {
    return (this.prisma.user as any).findUnique({ where: { id: +id }, include: { profile: true } });
  }

  async update(id: number, dto: UpdateUserDto) {
    return (this.prisma.user as any).update({ where: { id: +id }, data: dto as any });
  }

  async remove(id: number) {
    return (this.prisma.user as any).delete({ where: { id: +id } });
  }
}
