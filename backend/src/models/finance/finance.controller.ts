import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CreateTransactionDto } from './dto';

@ApiTags('finance')
@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post('transaction')
  @ApiOperation({ summary: 'Create a financial transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created.' })
  create(@Body() dto: CreateTransactionDto) {
    return this.financeService.createTransaction(dto.userId, dto.amount, dto.type, dto.reason);
  }

  @Get('student/:id/balance')
  @ApiOperation({ summary: 'Get total balance for a student' })
  getBalance(@Param('id') id: string) {
    return this.financeService.getBalance(+id);
  }

  @Get('student/:id/transactions')
  @ApiOperation({ summary: 'Get all transactions for a student' })
  findAllByStudent(@Param('id') id: string) {
    return this.financeService.findAllByStudent(+id);
  }
}
