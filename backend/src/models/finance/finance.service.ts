import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { UserRole } from 'src/core/enums';

@Injectable()
export class FinanceService {
  constructor(
    private prisma: PrismaService,
    private notification: NotificationService
  ) {}

  async createTransaction(userId: number, amount: number, type: string, reason: string) {
    const transaction = await (this.prisma.financeTransaction as any).create({
      data: { userId: +userId, amount, type, reason } as any
    });

    await this.notification.create({
      userId: +userId,
      title: 'Transaction Successful',
      body: `A ${type} transaction of ${amount} for ${reason} has been recorded.`
    } as any);

    return transaction;
  }

  async findAllByStudent(userId: number) {
    return (this.prisma.financeTransaction as any).findMany({ 
      where: { userId: +userId } 
    });
  }

  async getBalance(userId: number) {
    const transactions = await (this.prisma.financeTransaction as any).findMany({ 
      where: { userId: +userId } 
    });
    return (transactions as any[]).reduce((acc, t) => acc + (t.type === 'INCOME' ? t.amount : -t.amount), 0);
  }

  async getSummary(currentUser: { id: number; role: string }) {
    const where =
      currentUser.role === UserRole.SUPERADMIN || currentUser.role === UserRole.ADMIN
        ? {}
        : { userId: +currentUser.id };

    const transactions = await (this.prisma.financeTransaction as any).findMany({ where });

    const income = (transactions as any[])
      .filter((transaction) => transaction.type === 'INCOME')
      .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);

    const expense = (transactions as any[])
      .filter((transaction) => transaction.type === 'EXPENSE')
      .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }

  async getTransactions(currentUser: { id: number; role: string }) {
    const where =
      currentUser.role === UserRole.SUPERADMIN || currentUser.role === UserRole.ADMIN
        ? {}
        : { userId: +currentUser.id };

    return (this.prisma.financeTransaction as any).findMany({
      where,
      orderBy: { id: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });
  }
}
