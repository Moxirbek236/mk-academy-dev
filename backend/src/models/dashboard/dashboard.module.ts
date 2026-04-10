import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { JwtModule } from '@nestjs/jwt';
<<<<<<< HEAD
import { PrismaService } from 'src/core/config/prisma.service';

@Module({
  imports: [JwtModule],
=======
import { PrismaModule } from 'src/core/config/prisma.module';
import { SystemModule } from '../system/system.module';

@Module({
  imports: [JwtModule, PrismaModule, SystemModule],
>>>>>>> 311dc82f57ba437610a1159ca0b5efa00f66da92
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [JwtModule]
})
<<<<<<< HEAD
export class DashboardModule {}
=======
export class DashboardModule { }
>>>>>>> 311dc82f57ba437610a1159ca0b5efa00f66da92

