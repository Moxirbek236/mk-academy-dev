import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';

@Injectable()
export class XPService {
  constructor(private prisma: PrismaService) {}

  async addXP(userId: number, amount: number, reason: string) {
    const transaction = await this.prisma.xpTransaction.create({
      data: { studentId: +userId, amount, reason } as any
    });

    // Update leaderboard score (upsert)
    await this.prisma.leaderboard.upsert({
      where: { id: +userId }, // Assuming user id maps to leaderboard id for simplicity or use unique [studentId, scope]
      update: { score: { increment: amount } },
      create: { studentId: +userId, score: amount, scope: 'GLOBAL' }
    } as any);

    return transaction;
  }

  async getRank(userId: number) {
    const userEntry = await (this.prisma.leaderboard as any).findFirst({ 
      where: { studentId: +userId } 
    });
    if (!userEntry) return 0;
    
    const count = await (this.prisma.leaderboard as any).count({
      where: { score: { gt: userEntry.score } }
    });
    return count + 1;
  }
}
