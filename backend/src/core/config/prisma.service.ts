import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { resolve } from 'path';

function toSqliteFileUrl(filePath: string): string {
  return `file:${filePath.replace(/\\/g, '/')}`;
}

function resolveDatabaseUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const isRenderRuntime = Boolean(process.env.RENDER) || process.env.NODE_ENV === 'production';
  return isRenderRuntime
    ? 'file:/tmp/mk-academy.db'
    : toSqliteFileUrl(resolve(process.cwd(), 'prisma', 'dev.db'));
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
    if (!process.env.DATABASE_URL) {
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
