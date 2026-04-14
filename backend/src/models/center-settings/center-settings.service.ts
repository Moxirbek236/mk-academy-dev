import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/config/prisma.service';
import { UpdateCenterSettingsDto } from './dto';

const DEFAULT_CENTER_SETTINGS = {
  name: 'MK Academy',
  shortName: 'MK Academy',
  logoUrl:
    'https://res.cloudinary.com/dpfbu9aid/image/upload/v1775282809/academy_kaomaq.jpg',
  description:
    "Ingliz tilini CEFR standarti bo'yicha noldan professional darajagacha o'rganish platformasi.",
};

@Injectable()
export class CenterSettingsService {
  private readonly logger = new Logger(CenterSettingsService.name);

  constructor(private readonly prisma: PrismaService) {}

  private isMissingCenterSettingsTable(error: unknown) {
    const prismaError = error as { code?: string; meta?: { table?: string } };

    return (
      prismaError?.code === 'P2021' &&
      String(prismaError?.meta?.table || '').includes('center_settings')
    );
  }

  private buildFallbackSettings() {
    const now = new Date();

    return {
      id: 1,
      isFallback: true,
      ...DEFAULT_CENTER_SETTINGS,
      createdAt: now,
      updatedAt: now,
    };
  }

  private normalizeRecord(record: any) {
    return {
      id: record.id,
      name: record.name || DEFAULT_CENTER_SETTINGS.name,
      shortName:
        record.shortName || record.name || DEFAULT_CENTER_SETTINGS.shortName,
      logoUrl: record.logoUrl || DEFAULT_CENTER_SETTINGS.logoUrl,
      description: record.description || DEFAULT_CENTER_SETTINGS.description,
      updatedAt: record.updatedAt,
      createdAt: record.createdAt,
    };
  }

  private async ensureSettings() {
    try {
      const existing = await (this.prisma as any).centerSettings.findFirst({
        where: {
          isActive: true,
        },
        orderBy: {
          id: 'asc',
        },
      });

      if (existing) {
        return existing;
      }

      return await (this.prisma as any).centerSettings.create({
        data: {
          ...DEFAULT_CENTER_SETTINGS,
          isActive: true,
        },
      });
    } catch (error) {
      if (this.isMissingCenterSettingsTable(error)) {
        this.logger.warn(
          'The center_settings table is missing. Falling back to default branding until the Prisma migration is applied.',
        );

        return this.buildFallbackSettings();
      }

      throw error;
    }
  }

  async findPublic() {
    const settings = await this.ensureSettings();

    return {
      success: true,
      data: this.normalizeRecord(settings),
    };
  }

  async findPrivate() {
    return this.findPublic();
  }

  async update(dto: UpdateCenterSettingsDto) {
    const current = await this.ensureSettings();

    if (current?.isFallback) {
      throw new ServiceUnavailableException(
        'Center branding table is not ready yet. Apply the latest Prisma migration first.',
      );
    }

    const data: Record<string, unknown> = {};

    if (typeof dto.name === 'string' && dto.name.trim()) {
      data.name = dto.name.trim();
    }

    if (typeof dto.shortName === 'string' && dto.shortName.trim()) {
      data.shortName = dto.shortName.trim();
    }

    if (typeof dto.logoUrl === 'string' && dto.logoUrl.trim()) {
      data.logoUrl = dto.logoUrl.trim();
    }

    if (typeof dto.description === 'string') {
      data.description = dto.description.trim() || null;
    }

    try {
      const updated = await (this.prisma as any).centerSettings.update({
        where: {
          id: current.id,
        },
        data,
      });

      return {
        success: true,
        data: this.normalizeRecord(updated),
      };
    } catch (error) {
      if (this.isMissingCenterSettingsTable(error)) {
        throw new ServiceUnavailableException(
          'Center branding table is not ready yet. Apply the latest Prisma migration first.',
        );
      }

      throw error;
    }
  }
}
