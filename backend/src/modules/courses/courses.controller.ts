import { Controller, Get, Param, Post, Body, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async findAll() {
    return this.coursesService.findAll();
  }

  @Get('my-learning')
  async findMyLearning(@Request() req) {
    return this.coursesService.findMyLearning(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'SUPERADMIN')
  async create(@Body() data: any) {
    return this.coursesService.create(data);
  }

  @Patch(':id')
  @Roles('ADMIN', 'SUPERADMIN')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.coursesService.update(id, data);
  }

  @Delete(':id')
  @Roles('ADMIN', 'SUPERADMIN')
  async remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
