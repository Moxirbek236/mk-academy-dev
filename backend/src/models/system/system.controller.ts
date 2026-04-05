import { Controller, Get } from '@nestjs/common';
import { SystemService } from './system.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('system')
@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('health')
  @ApiOperation({ summary: 'Check API health status' })
  @ApiResponse({ status: 200, description: 'System is healthy.' })
  getHealth() {
    return this.systemService.getHealth();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get system resource statistics' })
  @ApiResponse({ status: 200, description: 'Return stats.' })
  getStats() {
    return this.systemService.getStats();
  }
}
