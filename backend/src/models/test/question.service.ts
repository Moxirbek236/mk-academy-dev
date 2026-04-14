import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';
import { CreateQuestionDto } from './dto';
import { CurrentUser, TestService } from './test.service';

@Injectable()
export class QuestionService {
  constructor(
    private prisma: PrismaService,
    private testService: TestService,
  ) {}

  async create(testId: number, data: CreateQuestionDto, currentUser: CurrentUser) {
    await this.testService.assertCanManageTest(+testId, currentUser);

    const question = await (this.prisma.question as any).create({
      data: {
        ...this.testService.normalizeQuestionForWrite(data),
        testId: +testId,
      } as any,
    });

    return {
      status: 201,
      success: true,
      message: 'Question successfully created',
      data: this.testService.normalizeQuestion(question, currentUser),
    };
  }

  async findAllByTest(testId: number, currentUser: CurrentUser) {
    await this.testService.assertCanReadTest(+testId, currentUser);

    const questions = await (this.prisma.question as any).findMany({
      where: { testId: +testId, isActive: true },
      orderBy: { id: 'asc' },
    });

    return {
      data: questions.map((question: any) =>
        this.testService.normalizeQuestion(question, currentUser),
      ),
    };
  }

  async update(id: number, data: Partial<CreateQuestionDto>, currentUser: CurrentUser) {
    const question = await (this.prisma.question as any).findUnique({
      where: { id: +id },
      select: { id: true, testId: true },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    await this.testService.assertCanManageTest(question.testId, currentUser);

    const updated = await (this.prisma.question as any).update({
      where: { id: +id },
      data: this.testService.normalizeQuestionForWrite(data),
    });

    return {
      status: 200,
      success: true,
      message: 'Question successfully updated',
      data: this.testService.normalizeQuestion(updated, currentUser),
    };
  }

  async remove(id: number, currentUser: CurrentUser) {
    const question = await (this.prisma.question as any).findUnique({
      where: { id: +id },
      select: { id: true, testId: true },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    await this.testService.assertCanManageTest(question.testId, currentUser);

    await (this.prisma.question as any).update({
      where: { id: +id },
      data: { isActive: false },
      select: { id: true },
    });

    return {
      status: 200,
      success: true,
      message: 'Question successfully deleted',
    };
  }
}
