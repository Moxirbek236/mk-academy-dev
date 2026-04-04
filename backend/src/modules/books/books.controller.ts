import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { BooksService } from './books.service';
// Using string for CefrLevel due to SQLite migration.

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) { }

  @Get()
  async findAll(
    @Query('cefr') cefr?: string,
  ) {
    return this.booksService.findAll(cefr);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    // Admin/Teacher ruxsatnomalarini keyingi bosqichda qo'shaman
    return this.booksService.create(data);
  }
}
