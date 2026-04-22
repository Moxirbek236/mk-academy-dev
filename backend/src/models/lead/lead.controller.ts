import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LeadService } from './lead.service';
import { CreateLeadDto, UpdateLeadAnswerDto, UpdateLeadStatusDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('leads')
@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new study request (from landing page)' })
  @ApiResponse({ status: 201, description: 'Request submitted successfully.' })
  create(@Body() dto: CreateLeadDto) {
    return this.leadService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all study requests (Admin only)' })
  findAll() {
    return this.leadService.findAll();
  }

  @Get('public/questions')
  @ApiOperation({ summary: 'Get answered course questions for the landing page' })
  findPublishedQuestions() {
    return this.leadService.findPublishedQuestions();
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update request status (Admin only)' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateLeadStatusDto) {
    return this.leadService.updateStatus(+id, dto);
  }

  @Patch(':id/answer')
  @ApiOperation({ summary: 'Answer a course question and optionally publish it on landing page' })
  updateAnswer(@Param('id') id: string, @Body() dto: UpdateLeadAnswerDto) {
    return this.leadService.updateAnswer(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete request (Admin only)' })
  remove(@Param('id') id: string) {
    return this.leadService.remove(+id);
  }
}
