import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ExamType } from '@prisma/client';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { SearchStudentDto } from './dto/search-student.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('users')
  createAdmin(@Body() dto: CreateAdminDto) {
    return this.adminService.create(dto);
  }

  @Get('users')
  getAdmins() {
    return this.adminService.findAllAdmins();
  }

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('results')
  getResults(
    @Query('examType') examType: ExamType = ExamType.CEFR,
    @Query('limit') limit = '10',
  ) {
    return this.adminService.getResultsByExamType(examType, Number(limit) || 10);
  }

  @Get('search')
  searchStudents(@Query() query: SearchStudentDto) {
    return this.adminService.searchStudents(query.query, query.limit ?? 10);
  }

  @Get('leads')
  getLeads(@Query('limit') limit = '10') {
    return this.adminService.getRecentLeads(Number(limit) || 10);
  }
}
