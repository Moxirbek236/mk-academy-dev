import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async getTransactions() {
    return this.prisma.financeTransaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { user: { select: { fullName: true } } }
    });
  }

  async getFinanceSummary() {
    const [income, expense] = await this.prisma.$transaction([
      this.prisma.financeTransaction.aggregate({
        _sum: { amount: true },
        where: { type: 'INCOME' }
      }),
      this.prisma.financeTransaction.aggregate({
        _sum: { amount: true },
        where: { type: 'EXPENSE' }
      })
    ]);

    return {
      balance: (income._sum.amount || 0) - (expense._sum.amount || 0),
      income: income._sum.amount || 0,
      expense: expense._sum.amount || 0,
      growthPerc: 14.2
    };
  }
}
