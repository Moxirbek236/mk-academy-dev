import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('stats')
  async getDashboardStats(@Request() req) {
    try {
      const { role, id } = req.user;
      
      if (role === 'SUPERADMIN') {
        return await this.dashboardService.getSuperadminStats();
      } else if (role === 'ADMIN') {
        return await this.dashboardService.getAdminStats();
      } else if (role === 'TEACHER') {
        return await this.dashboardService.getTeacherStats(id);
      } else {
        return await this.dashboardService.getStudentStats(id);
      }
    } catch (error) {
      console.error('DASHBOARD STATS ERROR:', error);
      throw error;
    }
  }
}
