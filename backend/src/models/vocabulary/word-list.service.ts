import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';

@Injectable()
export class WordListService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, title: string) {
    return (this.prisma.wordList as any).create({
      data: { userId: +userId, title } as any
    });
  }

  async findByUser(userId: number) {
    return (this.prisma.wordList as any).findMany({
      where: { userId: +userId },
      include: { words: true }
    });
  }
}
