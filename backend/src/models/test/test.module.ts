import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { TestAttemptService } from './test-attempt.service';
import { TestAttemptController } from './test-attempt.controller';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
  imports: [GamificationModule],
  controllers: [
    TestController,
    QuestionController,
    TestAttemptController,
  ],
  providers: [
    TestService,
    QuestionService,
    TestAttemptService,
  ],
  exports: [TestService, QuestionService, TestAttemptService],
})
export class TestModule {}
