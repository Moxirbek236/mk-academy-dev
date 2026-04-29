import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { CenterInfoModule } from '../center-info/center-info.module';
import { CoursesModule } from '../courses/courses.module';
import { LeadsModule } from '../leads/leads.module';
import { ResultsModule } from '../results/results.module';
import { BotStateService } from './bot-state.service';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';

@Module({
  imports: [
    AdminModule,
    ResultsModule,
    LeadsModule,
    CenterInfoModule,
    CoursesModule,
  ],
  providers: [BotService, BotStateService, BotUpdate],
})
export class BotModule {}
