import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { AdminModule } from './admin/admin.module';
import { BotModule } from './bot/bot.module';
import { CenterInfoModule } from './center-info/center-info.module';
import { CoursesModule } from './courses/courses.module';
import { LeadsModule } from './leads/leads.module';
import { PrismaModule } from './prisma/prisma.module';
import { ResultsModule } from './results/results.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        token: configService.getOrThrow<string>('BOT_TOKEN'),
      }),
    }),
    PrismaModule,
    AdminModule,
    ResultsModule,
    LeadsModule,
    CenterInfoModule,
    CoursesModule,
    BotModule,
  ],
})
export class AppModule {}
