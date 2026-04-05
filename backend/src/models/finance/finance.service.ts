import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';
import { NotificationService } from '../notification/notification.service';

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
}
