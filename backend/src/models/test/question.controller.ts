import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuestionService } from './question.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('questions')
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('test/:testId')
  @ApiOperation({ summary: 'Add a question to a test' })
  create(@Param('testId') testId: string, @Body() data: any) {
    return this.questionService.create(+testId, data);
  }

  @Get('test/:testId')
  @ApiOperation({ summary: 'Get all questions for a test' })
  findAllByTest(@Param('testId') testId: string) {
    return this.questionService.findAllByTest(+testId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update question' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.questionService.update(+id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove question' })
  remove(@Param('id') id: string) {
    return this.questionService.remove(+id);
  }
}
