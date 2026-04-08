import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/core/config/prisma.service';

@Module({
  imports: [JwtModule],
  controllers: [DashboardController],
  providers: [DashboardService, PrismaService],
  exports: [JwtModule]
})
export class DashboardModule { }

