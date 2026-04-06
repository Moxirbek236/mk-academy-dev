import { Injectable } from '@nestjs/common';

@Injectable()
export class SystemService {
  async getHealth() {
    return { status: 'ok', timestamp: new Date(), uptime: process.uptime() };
  }

  async getStats() {
    return {
      cpu: process.cpuUsage(),
      memory: process.memoryUsage(),
      platform: process.platform,
      arch: process.arch,
    };
  }
}
