import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { WordListService } from './word-list.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('word-lists')
@Controller('word-lists')
export class WordListController {
  constructor(private readonly service: WordListService) {}

  @Post('user/:userId')
  @ApiOperation({ summary: 'Create a custom word list' })
  create(@Param('userId') userId: string, @Body() body: { title: string }) {
    return this.service.create(+userId, body.title);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all word lists for a user' })
  findAll(@Param('userId') userId: string) {
    return this.service.findByUser(+userId);
  }
}
