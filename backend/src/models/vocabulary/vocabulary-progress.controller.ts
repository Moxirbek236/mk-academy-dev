import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { VocabularyProgressService } from './vocabulary-progress.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('vocabulary-progress')
@Controller('vocabulary-progress')
export class VocabularyProgressController {
  constructor(private readonly service: VocabularyProgressService) {}

  @Post(':studentId/word/:wordId')
  @ApiOperation({ summary: 'Update word mastery progress' })
  update(@Param('studentId') studentId: string, @Param('wordId') wordId: string, @Body() body: { status: string }) {
    return this.service.updateProgress(+studentId, +wordId, body.status);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get all vocabulary progress for a student' })
  findAll(@Param('studentId') studentId: string) {
    return this.service.findByStudent(+studentId);
  }
}
