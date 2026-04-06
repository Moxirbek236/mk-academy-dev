import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';
import { CreateUserProfileDto, UpdateUserProfileDto } from './dto';

@Injectable()
export class UserProfileService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserProfileDto) {
    return this.prisma.userProfile.create({ data: dto as any });
  }

  async findByUserId(userId: number) {
    // return this.prisma.userProfile.findUnique({ where: { userId } });
  }

  async update(dto: UpdateUserProfileDto) {
    return 
  }

  async remove(id: number) {
    return this.prisma.userProfile.delete({ where: { id: +id } as any });
  }
}
