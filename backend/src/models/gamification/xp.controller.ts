import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { XPService } from './xp.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('xp')
@Controller('xp')
export class XpController {
  constructor(private readonly service: XPService) {}

  @Post('add/:userId')
  @ApiOperation({ summary: 'Add XP to a student (Admin/System only)' })
  @ApiResponse({ status: 201, description: 'XP added successfully.' })
  addXP(
    @Param('userId') userId: string,
    @Body() body: { amount: number; reason: string }
  ) {
    return this.service.addXP(+userId, body.amount, body.reason);
  }

  @Get('rank/:userId')
  @ApiOperation({ summary: 'Get current rank of a student' })
  @ApiResponse({ status: 200, description: 'Return student rank.' })
  getRank(@Param('userId') userId: string) {
    return this.service.getRank(+userId);
  }
}
