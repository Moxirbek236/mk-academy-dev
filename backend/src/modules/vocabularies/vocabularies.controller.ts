import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { VocabularysService } from './vocabularies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('vocabularies')
@UseGuards(JwtAuthGuard)
export class VocabularysController {
  constructor(private readonly service: VocabularysService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.service.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
