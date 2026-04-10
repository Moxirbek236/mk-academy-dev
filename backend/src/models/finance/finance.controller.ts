import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';

import { CreateTransactionDto } from './dto';

@ApiTags('finance')
@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @UseGuards(AuthGuard)
  @Get('summary')
  @ApiOperation({ summary: 'Get finance summary for the current user scope' })
  getSummary(@Req() req: any) {
    return this.financeService.getSummary(req['user']);
  }

  @UseGuards(AuthGuard)
  @Get('transactions')
  @ApiOperation({ summary: 'Get finance transactions for the current user scope' })
  getTransactions(@Req() req: any) {
    return this.financeService.getTransactions(req['user']);
  }

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
