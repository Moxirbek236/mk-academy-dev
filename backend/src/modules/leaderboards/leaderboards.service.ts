import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LeaderboardsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.leaderboard.findMany();
  }

  async findOne(id: string) {
    const item = await this.prisma.leaderboard.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Topilmadi');
    return item;
  }

  async create(data: any) {
    return this.prisma.leaderboard.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.leaderboard.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.leaderboard.delete({ where: { id } });
  }
}
