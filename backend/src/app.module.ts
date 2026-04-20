import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './core/config/prisma.module';
import { GroupMemberModule } from './models/group-member/group-member.module';
import { GroupCourseModule } from './models/group-course/group-course.module';
import { QuestionsModule } from './models/questions/questions.module';
import * as Models from './models';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
    PrismaModule,
    ...Object.values(Models),
    GroupMemberModule,
    GroupCourseModule,
    QuestionsModule,
  ],
})
export class AppModule {}
