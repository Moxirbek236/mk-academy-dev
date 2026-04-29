import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ChildProcess, spawn } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class BotRunnerService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger(BotRunnerService.name);
  private botProcess: ChildProcess | null = null;

  async onApplicationBootstrap(): Promise<void> {
    const botRoot = join(process.cwd(), 'src', 'models', 'bot');
    const botEnv = this.readBotEnv(botRoot);

    const autoStart = (process.env.BOT_AUTO_START ?? 'true').toLowerCase();
    if (autoStart === 'false' || autoStart === '0' || autoStart === 'no') {
      this.logger.log('BOT_AUTO_START o`chirilgan. Bot ishga tushirilmadi.');
      return;
    }

    const botToken = (process.env.BOT_TOKEN ?? botEnv.BOT_TOKEN)?.trim();
    if (!botToken) {
      this.logger.warn(
        'BOT_TOKEN topilmadi. Bot ishga tushmadi. backend/.env yoki src/models/bot/.env ga BOT_TOKEN qo`shing.',
      );
      return;
    }

    const botEntry = join(botRoot, 'dist', 'src', 'main.js');

    if (!existsSync(botRoot)) {
      this.logger.warn(`Bot papkasi topilmadi: ${botRoot}`);
      return;
    }

    if (!existsSync(botEntry)) {
      this.logger.warn(
        `Bot build topilmadi: ${botEntry}. Botni bir marta build qiling (src/models/bot).`,
      );
      return;
    }

    this.botProcess = spawn('node', [botEntry], {
      cwd: botRoot,
      env: {
        ...botEnv,
        ...process.env,
        BOT_TOKEN: botToken,
        BOT_HTTP_ENABLED:
          process.env.BOT_HTTP_ENABLED ??
          botEnv.BOT_HTTP_ENABLED ??
          'false',
        PORT: process.env.BOT_PORT ?? '0',
      },
      stdio: 'inherit',
      windowsHide: true,
    });

    this.botProcess.once('spawn', () => {
      this.logger.log('Telegram bot backend bilan birga ishga tushdi.');
    });

    this.botProcess.once('exit', (code, signal) => {
      this.logger.warn(
        `Telegram bot jarayoni to'xtadi (code=${code ?? 'null'}, signal=${
          signal ?? 'null'
        }).`,
      );
      this.botProcess = null;
    });

    this.botProcess.once('error', (error) => {
      this.logger.error(
        `Telegram botni ishga tushirishda xato: ${error.message}`,
      );
      this.botProcess = null;
    });
  }

  async onApplicationShutdown(): Promise<void> {
    if (!this.botProcess) {
      return;
    }

    if (this.botProcess.killed) {
      this.botProcess = null;
      return;
    }

    const pid = this.botProcess.pid;
    this.botProcess.kill('SIGTERM');
    this.botProcess = null;
    this.logger.log(`Telegram bot jarayoni yopildi (pid=${pid ?? 'unknown'}).`);
  }

  private readBotEnv(botRoot: string): NodeJS.ProcessEnv {
    const envPath = join(botRoot, '.env');
    if (!existsSync(envPath)) {
      return {};
    }

    try {
      const raw = readFileSync(envPath, 'utf8');
      const entries = raw
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#'))
        .map((line) => {
          const separatorIndex = line.indexOf('=');
          if (separatorIndex < 0) {
            return null;
          }

          const key = line.slice(0, separatorIndex).trim();
          const value = line.slice(separatorIndex + 1).trim();
          if (!key) {
            return null;
          }

          return [key, value] as const;
        })
        .filter((entry): entry is readonly [string, string] => Boolean(entry));

      return Object.fromEntries(entries);
    } catch (error) {
      this.logger.warn(
        `Bot .env ni o'qib bo'lmadi: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
      );
      return {};
    }
  }
}
