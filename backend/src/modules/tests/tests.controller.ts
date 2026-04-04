import { Controller, Get, Param, Post, Body, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { TestsService } from './tests.service';

@Controller('tests')
export class TestsController {
  constructor(private testsService: TestsService) {}

  @Get()
  async findAll() {
    return this.testsService.findAll();
  }

  @Get('my-attempts')
  async findMyAttempts(@Request() req) {
    return this.testsService.findAttemptsByStudent(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.testsService.findOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.testsService.create(data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.testsService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.testsService.remove(id);
  }
}
