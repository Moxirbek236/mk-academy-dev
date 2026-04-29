import { Injectable, NotFoundException } from '@nestjs/common';
import { ExamType, StudentResult } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentResultDto } from './dto/create-student-result.dto';
import { QueryStudentResultsDto } from './dto/query-student-results.dto';

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateStudentResultDto): Promise<StudentResult> {
    return this.prisma.studentResult.create({
      data: {
        ...dto,
        examDate: new Date(dto.examDate),
      },
    });
  }

  async findAll(query: QueryStudentResultsDto): Promise<StudentResult[]> {
    return this.prisma.studentResult.findMany({
      where: {
        examType: query.examType,
        studentFullName: query.search
          ? {
              contains: query.search,
              mode: 'insensitive',
            }
          : undefined,
      },
      orderBy: [{ examDate: 'desc' }, { createdAt: 'desc' }],
      take: query.limit ?? 10,
    });
  }

  async findByExamType(
    examType: ExamType,
    limit = 10,
  ): Promise<StudentResult[]> {
    return this.findAll({
      examType,
      limit,
    });
  }

  async findOne(id: number): Promise<StudentResult> {
    const result = await this.prisma.studentResult.findUnique({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException('Natija topilmadi');
    }

    return result;
  }

  async searchByStudent(query: string, limit = 10): Promise<StudentResult[]> {
    return this.findAll({
      search: query,
      limit,
    });
  }

  async getSummary(): Promise<{
    total: number;
    cefrCount: number;
    ieltsCount: number;
  }> {
    const [total, cefrCount, ieltsCount] = await Promise.all([
      this.prisma.studentResult.count(),
      this.prisma.studentResult.count({
        where: { examType: ExamType.CEFR },
      }),
      this.prisma.studentResult.count({
        where: { examType: ExamType.IELTS },
      }),
    ]);

    return {
      total,
      cefrCount,
      ieltsCount,
    };
  }
}
