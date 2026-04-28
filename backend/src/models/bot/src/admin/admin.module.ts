import { Module } from '@nestjs/common';
import { LeadsModule } from '../leads/leads.module';
import { ResultsModule } from '../results/results.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [ResultsModule, LeadsModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
