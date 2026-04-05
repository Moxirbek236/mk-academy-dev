import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  async getTopUsers(limit: number = 10) {
    return this.prisma.leaderboard.findMany({
      orderBy: { score: 'desc' },
      take: +limit,
      include: { student: { select: { id: true, fullName: true, avatarUrl: true } } }
    });
  }
}
