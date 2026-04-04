import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly service: TasksService) {}

  @Get()
  async findAll(@Request() req) {
    const isTeacher = req.user.role === 'TEACHER';
    if (isTeacher) {
      return this.service.findAll(req.user.id);
    }
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'SUPERADMIN', 'TEACHER')
  async create(@Body() data: any, @Request() req) {
    return this.service.create({ 
      ...data, 
      createdById: req.user.id 
    });
  }

  @Patch(':id')
  @Roles('ADMIN', 'SUPERADMIN', 'TEACHER')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @Roles('ADMIN', 'SUPERADMIN')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
