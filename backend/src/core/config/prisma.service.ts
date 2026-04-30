import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

function resolveDatabaseUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const isRenderRuntime = Boolean(process.env.RENDER) || process.env.NODE_ENV === 'production';
  if (isRenderRuntime) {
    throw new Error('DATABASE_URL is required in production/runtime environment');
  }

  return 'file:./prisma/dev.db';
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const databaseUrl = resolveDatabaseUrl();

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
    if (!process.env.DATABASE_URL && process.env.NODE_ENV !== 'production') {
      this.logger.warn(`DATABASE_URL not set. Using fallback: ${resolveDatabaseUrl()}`);
    }

    await this.$connect();
    this.logger.log('Prisma connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Prisma disconnected');
  }
}
