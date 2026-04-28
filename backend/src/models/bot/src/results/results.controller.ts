import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ResultsService } from './results.service';
import { CreateStudentResultDto } from './dto/create-student-result.dto';
import { QueryStudentResultsDto } from './dto/query-student-results.dto';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post()
  create(@Body() dto: CreateStudentResultDto) {
    return this.resultsService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryStudentResultsDto) {
    return this.resultsService.findAll(query);
  }

  @Get('search')
  search(@Query('query') query: string, @Query('limit') limit = '10') {
    return this.resultsService.searchByStudent(query, Number(limit) || 10);
  }

  @Get('summary')
  getSummary() {
    return this.resultsService.getSummary();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.resultsService.findOne(id);
  }
}
