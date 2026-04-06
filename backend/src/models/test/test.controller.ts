import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDto, UpdateTestDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('tests')
@Controller('tests')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new test template' })
  @ApiResponse({ status: 201, description: 'Test created.' })
  create(@Body() dto: CreateTestDto) {
    return this.testService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tests' })
  findAll() {
    return this.testService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get test by ID' })
  findOne(@Param('id') id: string) {
    return this.testService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update test' })
  update(@Param('id') id: string, @Body() dto: UpdateTestDto) {
    return this.testService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete test' })
  remove(@Param('id') id: string) {
    return this.testService.remove(+id);
  }
}
