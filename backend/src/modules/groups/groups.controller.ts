import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private readonly service: GroupsService) {}

  @Get()
  async findAll(@Request() req) {
    const isTeacher = req.user.role === 'TEACHER';
    const isStudent = req.user.role === 'STUDENT';
    
    if (isTeacher) {
      return this.service.findAll(req.user.id);
    }
    
    // Adminlar/Superadminlar barchasini ko'radi, talabalar o'z guruhlarini ko'rishi kerak
    // Hozirda umumiy findAll ishlatamiz, kelajakda student uchun findMyGroups qilinadi
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'SUPERADMIN')
  async create(@Body() data: any) {
    return this.service.create(data);
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
