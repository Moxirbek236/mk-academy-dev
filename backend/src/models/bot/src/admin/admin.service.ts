import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Admin, Prisma } from '@prisma/client';
import { LeadsService } from '../leads/leads.service';
import { PrismaService } from '../prisma/prisma.service';
import { ResultsService } from '../results/results.service';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly resultsService: ResultsService,
    private readonly leadsService: LeadsService,
  ) {}

  async create(dto: CreateAdminDto): Promise<Admin> {
    const telegramUserId = this.normalizeTelegramUserId(dto.telegramUserId);
    const telegramUsername = this.normalizeTelegramUsername(dto.telegramUsername);

    if (!telegramUserId && !telegramUsername) {
      throw new BadRequestException(
        'Admin qo\'shish uchun telegramUserId yoki telegramUsername berilishi kerak',
      );
    }

    const existingAdmin = await this.findAdminByIdentity({
      telegramUserId,
      telegramUsername,
    });

    if (existingAdmin) {
      return this.prisma.admin.update({
        where: { id: existingAdmin.id },
        data: {
          fullName: dto.fullName,
          ...(telegramUserId ? { telegramUserId } : {}),
          ...(telegramUsername ? { telegramUsername } : {}),
        },
      });
    }

    return this.prisma.admin.create({
      data: {
        fullName: dto.fullName,
        ...(telegramUserId ? { telegramUserId } : {}),
        ...(telegramUsername ? { telegramUsername } : {}),
      },
    });
  }

  async isAdmin(identity: {
    telegramUserId?: number | string | null;
    telegramUsername?: string | null;
  }): Promise<boolean> {
    const normalizedId = this.normalizeTelegramUserId(identity.telegramUserId);
    const normalizedUsername = this.normalizeTelegramUsername(
      identity.telegramUsername,
    );

    if (normalizedId && this.getConfiguredAdminIds().includes(normalizedId)) {
      return true;
    }

    if (
      normalizedUsername &&
      this.getConfiguredAdminUsernames().includes(normalizedUsername)
    ) {
      return true;
    }

    const admin = await this.findAdminByIdentity({
      telegramUserId: normalizedId,
      telegramUsername: normalizedUsername,
    });

    return Boolean(admin);
  }

  async getStats(): Promise<{
    total: number;
    cefrCount: number;
    ieltsCount: number;
  }> {
    return this.resultsService.getSummary();
  }

  async getResultsByExamType(examType: 'CEFR' | 'IELTS', limit = 10) {
    return this.resultsService.findByExamType(examType, limit);
  }

  async searchStudents(query: string, limit = 10) {
    return this.resultsService.searchByStudent(query, limit);
  }

  async getRecentLeads(limit = 10) {
    return this.leadsService.findAll(limit);
  }

  async findAllAdmins(): Promise<Admin[]> {
    return this.prisma.admin.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  async addAdminByUsername(
    rawUsername: string,
    fullName?: string,
  ): Promise<Admin> {
    const telegramUsername = this.normalizeTelegramUsername(rawUsername);
    if (!telegramUsername) {
      throw new BadRequestException('Yaroqli username kiriting');
    }

    const existingAdmin = await this.findAdminByIdentity({ telegramUsername });
    const resolvedFullName = (fullName?.trim() || `@${telegramUsername}`).slice(
      0,
      120,
    );

    if (existingAdmin) {
      return this.prisma.admin.update({
        where: { id: existingAdmin.id },
        data: {
          telegramUsername,
          fullName: resolvedFullName,
        },
      });
    }

    return this.prisma.admin.create({
      data: {
        telegramUsername,
        fullName: resolvedFullName,
      },
    });
  }

  async removeAdminByUsername(rawUsername: string): Promise<boolean> {
    const telegramUsername = this.normalizeTelegramUsername(rawUsername);
    if (!telegramUsername) {
      throw new BadRequestException('Yaroqli username kiriting');
    }

    let found: { id: number } | null = null;
    try {
      found = await this.prisma.admin.findUnique({
        where: { telegramUsername },
        select: { id: true },
      });
    } catch (error) {
      if (this.isMissingTelegramUsernameColumn(error)) {
        return false;
      }
      throw error;
    }

    if (!found) {
      return false;
    }

    await this.prisma.admin.delete({
      where: { id: found.id },
    });

    return true;
  }

  formatAdminIdentity(admin: Pick<Admin, 'telegramUserId' | 'telegramUsername'>): string {
    if (admin.telegramUsername) {
      return `@${admin.telegramUsername}`;
    }

    if (admin.telegramUserId) {
      return `id:${admin.telegramUserId}`;
    }

    return 'unknown';
  }

  getConfiguredAdminIds(): string[] {
    const raw = this.configService.get<string>('ADMIN_TELEGRAM_IDS', '');
    return raw
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
  }

  getConfiguredAdminUsernames(): string[] {
    const raw = this.configService.get<string>('ADMIN_TELEGRAM_USERNAMES', '');
    return raw
      .split(',')
      .map((value) => this.normalizeTelegramUsername(value))
      .filter((value): value is string => Boolean(value));
  }

  private normalizeTelegramUserId(
    telegramUserId: number | string | null | undefined,
  ): string | undefined {
    if (telegramUserId === null || telegramUserId === undefined) {
      return undefined;
    }

    const normalized = String(telegramUserId).trim();
    return normalized || undefined;
  }

  private normalizeTelegramUsername(
    telegramUsername: string | null | undefined,
  ): string | undefined {
    if (!telegramUsername) {
      return undefined;
    }

    const normalized = telegramUsername.trim().replace(/^@+/, '').toLowerCase();
    return normalized || undefined;
  }

  private async findAdminByIdentity(identity: {
    telegramUserId?: string;
    telegramUsername?: string;
  }): Promise<Pick<Admin, 'id'> | null> {
    const { telegramUserId, telegramUsername } = identity;

    if (telegramUserId) {
      const adminById = await this.prisma.admin.findUnique({
        where: { telegramUserId },
        select: { id: true },
      });

      if (adminById) {
        return adminById;
      }
    }

    if (telegramUsername) {
      let adminByUsername: { id: number } | null = null;
      try {
        adminByUsername = await this.prisma.admin.findUnique({
          where: { telegramUsername },
          select: { id: true },
        });
      } catch (error) {
        if (!this.isMissingTelegramUsernameColumn(error)) {
          throw error;
        }
      }

      if (adminByUsername) {
        return adminByUsername;
      }
    }

    return null;
  }

  private isMissingTelegramUsernameColumn(error: unknown): boolean {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return false;
    }

    return (
      error.code === 'P2022' &&
      String((error.meta as { column?: string } | undefined)?.column ?? '').includes(
        'telegramUsername',
      )
    );
  }
}
