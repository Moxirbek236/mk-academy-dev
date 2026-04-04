import { Controller, Get, UseGuards } from '@nestjs/common';
import { FinanceService } from './finance.service';

@Controller('finance')
export class FinanceController {
  constructor(private financeService: FinanceService) {}

  @Get('transactions')
  async getTransactions() {
    return this.financeService.getTransactions();
  }

  @Get('summary')
  async getFinanceSummary() {
    return this.financeService.getFinanceSummary();
  }
}
