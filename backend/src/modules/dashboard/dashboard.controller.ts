import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('stats')
  async getDashboardStats(@Request() req) {
    const { role, id } = req.user;
    
    if (role === 'SUPERADMIN') {
      return this.dashboardService.getSuperadminStats();
    } else if (role === 'ADMIN') {
      return this.dashboardService.getAdminStats();
    } else if (role === 'TEACHER') {
      return this.dashboardService.getTeacherStats(id);
    } else {
      return this.dashboardService.getStudentStats(id);
    }
  }
}
