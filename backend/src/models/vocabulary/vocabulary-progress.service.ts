import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';

@Injectable()
export class VocabularyProgressService {
  constructor(private prisma: PrismaService) {}

  async updateProgress(studentId: number, vocabularyId: number, status: string) {
    return (this.prisma.vocabularyProgress as any).upsert({
      where: { studentId_vocabularyId: { studentId: +studentId, vocabularyId: +vocabularyId } },
      update: { status, lastReviewed: new Date() },
      create: { studentId: +studentId, vocabularyId: +vocabularyId, status } as any
    });
  }

  async findByStudent(studentId: number) {
    return (this.prisma.vocabularyProgress as any).findMany({
      where: { studentId: +studentId },
      include: { vocabulary: true }
    });
  }
}
