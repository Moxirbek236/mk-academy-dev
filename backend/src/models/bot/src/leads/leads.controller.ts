import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateLeadRequestDto } from './dto/create-lead-request.dto';
import { LeadsService } from './leads.service';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  create(@Body() dto: CreateLeadRequestDto) {
    return this.leadsService.create(dto);
  }

  @Get()
  findAll(@Query('limit') limit = '10') {
    return this.leadsService.findAll(Number(limit) || 10);
  }
}
