import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { NotificationModule } from '../notification/notification.module';
import { PrismaModule } from 'src/core/config/prisma.module';

@Module({
  imports: [NotificationModule, PrismaModule, JwtModule],
  controllers: [FinanceController],
  providers: [FinanceService],
  exports: [FinanceService],
})
export class FinanceModule {}
