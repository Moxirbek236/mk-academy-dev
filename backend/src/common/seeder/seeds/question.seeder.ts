import { Injectable } from '@nestjs/common';
import { questions, questionsB } from './questions.seed';
import { PrismaService } from 'src/core/config/prisma.service';

type RawSeedQuestion = {
  testId: number;
  type?: string;
  inputType?: string;
  questionText: string;
  options?: unknown;
  correctAnswer?: unknown;
  explanation?: string | null;
  points?: number;
  difficulty?: number;
  skill?: string | null;
  isActive?: boolean;
};


type SeedResult = {
  testsCreated: number;
  questionsCreated: number;
  questionsReactivated: number;
  totalSeedQuestions: number;
};

@Injectable()
export class SeedService {
  constructor(private readonly prisma: PrismaService) {}

  async seedQuestionsIfMissing(): Promise<SeedResult> {
    const allSeedQuestions = this.getAllSeedQuestions();
    const uniqueTestIds = [
      ...new Set(allSeedQuestions.map((question) => question.testId)),
    ];

    let testsCreated = 0;
    for (const testId of uniqueTestIds) {
      const existingTest = await this.prisma.test.findUnique({
        where: { id: testId },
        select: { id: true },
      });

      if (!existingTest) {
        await this.prisma.test.create({
          data: {
            id: testId,
            title: `Seed Test Variant ${testId}`,
            description: `Auto-created for question seed (testId=${testId})`,
            type: 'PRACTICE',
            passingScore: 0,
            isPublished: true,
            isActive: true,
          },
        });
        testsCreated += 1;
      }
    }

    const existingQuestions = await this.prisma.question.findMany({
      where: {
        testId: { in: uniqueTestIds },
      },
      select: {
        id: true,
        testId: true,
        questionText: true,
        isActive: true,
      },
    });

    const existingByKey = new Map<string, { id: number; isActive: boolean }>();
    for (const existingQuestion of existingQuestions) {
      existingByKey.set(
        this.buildQuestionKey(
          Number(existingQuestion.testId),
          String(existingQuestion.questionText),
        ),
        {
          id: Number(existingQuestion.id),
          isActive: Boolean(existingQuestion.isActive),
        },
      );
    }

    let questionsCreated = 0;
    let questionsReactivated = 0;

    for (const seedQuestion of allSeedQuestions) {
      const key = this.buildQuestionKey(seedQuestion.testId, seedQuestion.questionText);
      const existingQuestion = existingByKey.get(key);

      if (existingQuestion) {
        if (!existingQuestion.isActive) {
          await this.prisma.question.update({
            where: { id: existingQuestion.id },
            data: { isActive: true },
          });
          questionsReactivated += 1;
        }

        await this.ensureQuestionAnalytics(existingQuestion.id);
        continue;
      }

      const createdQuestion = await this.prisma.question.create({
        data: {
          testId: seedQuestion.testId,
          type: seedQuestion.type ?? 'MCQ',
          inputType: seedQuestion.inputType ?? 'OPTIONS',
          questionText: seedQuestion.questionText.trim(),
          options: this.encodeJsonField(seedQuestion.options),
          correctAnswer: this.encodeJsonField(seedQuestion.correctAnswer),
          explanation: seedQuestion.explanation ?? null,
          points: seedQuestion.points ?? 1,
          difficulty: seedQuestion.difficulty ?? 1,
          skill: seedQuestion.skill ?? null,
          isActive: seedQuestion.isActive ?? true,
        },
        select: { id: true },
      });

      await this.ensureQuestionAnalytics(Number(createdQuestion.id));
      questionsCreated += 1;
    }

    return {
      testsCreated,
      questionsCreated,
      questionsReactivated,
      totalSeedQuestions: allSeedQuestions.length,
    };
  }

  private async ensureQuestionAnalytics(questionId: number): Promise<void> {
    await this.prisma.questionAnalytics.upsert({
      where: { questionId },
      update: { isActive: true },
      create: {
        questionId,
        totalAttempts: 0,
        correctCount: 0,
        avgTimeSeconds: 0,
        isActive: true,
      },
    });
  }

  private getAllSeedQuestions(): RawSeedQuestion[] {
    return [...questions, ...questionsB].map((question) => ({
      ...question,
      questionText: String(question.questionText ?? '').trim(),
    }));
  }

  private buildQuestionKey(testId: number, questionText: string): string {
    return `${testId}::${questionText.trim()}`;
  }

  private encodeJsonField(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    if (typeof value === 'string') {
      return value;
    }

    return JSON.stringify(value);
  }
}
