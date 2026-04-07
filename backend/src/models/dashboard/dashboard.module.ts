import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/core/config/prisma.module';

@Module({
  imports: [JwtModule, PrismaModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
