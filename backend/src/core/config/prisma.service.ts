import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const databaseUrl = process.env.DATABASE_URL ?? 'file:./prisma/dev.db';

    super({
      log: ['warn', 'error'],
      errorFormat: 'pretty',
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
    Logger.log("Prisma connected", "PrismaService")
  }

  async onModuleDestroy() {
    await this.$disconnect();
    Logger.log("Prisma disconnected", "PrismaService")
  }
}
