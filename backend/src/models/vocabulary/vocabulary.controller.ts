import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { CreateVocabularyDto, UpdateVocabularyDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('vocabularies')
@Controller('vocabularies')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new word to vocabulary' })
  @ApiResponse({ status: 201, description: 'Word added.' })
  create(@Body() dto: CreateVocabularyDto) {
    return this.vocabularyService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vocabulary' })
  findAll() {
    return this.vocabularyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get word details' })
  findOne(@Param('id') id: string) {
    return this.vocabularyService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update word info' })
  update(@Param('id') id: string, @Body() dto: UpdateVocabularyDto) {
    return this.vocabularyService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete word' })
  remove(@Param('id') id: string) {
    return this.vocabularyService.remove(+id);
  }
}
