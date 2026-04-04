import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { BooksModule } from './modules/books/books.module';
import { VocabularysModule } from './modules/vocabularies/vocabularies.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { TestsModule } from './modules/tests/tests.module';
import { GroupsModule } from './modules/groups/groups.module';
import { LeaderboardsModule } from './modules/leaderboards/leaderboards.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { FinanceModule } from './modules/finance/finance.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100, // max 100 requests per minute
    }]),
    PrismaModule,
    UsersModule,
    AuthModule,
    BooksModule,
    VocabularysModule,
    TasksModule,
    TestsModule,
    GroupsModule,
    LeaderboardsModule,
    DashboardModule,
    FinanceModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
