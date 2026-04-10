import { Injectable } from '@nestjs/common';
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
  constructor(private readonly prisma: PrismaService) {}

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
    const existing = await (this.prisma.centerSettings as any).findFirst({
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

    return (this.prisma.centerSettings as any).create({
      data: {
        ...DEFAULT_CENTER_SETTINGS,
        isActive: true,
      },
    });
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

    const updated = await (this.prisma.centerSettings as any).update({
      where: {
        id: current.id,
      },
      data,
    });

    return {
      success: true,
      data: this.normalizeRecord(updated),
    };
  }
}
