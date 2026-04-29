import { Injectable, NotFoundException } from '@nestjs/common';
import { CenterInfo } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCenterInfoDto } from './dto/update-center-info.dto';

@Injectable()
export class CenterInfoService {
  constructor(private readonly prisma: PrismaService) {}

  async getCenterInfo(): Promise<CenterInfo> {
    const centerInfo = await this.prisma.centerInfo.findFirst({
      orderBy: { id: 'asc' },
    });

    if (!centerInfo) {
      throw new NotFoundException('O\'quv markaz ma\'lumotlari topilmadi');
    }

    return centerInfo;
  }

  async upsert(dto: UpdateCenterInfoDto): Promise<CenterInfo> {
    const existing = await this.prisma.centerInfo.findFirst({
      orderBy: { id: 'asc' },
      select: { id: true },
    });

    if (existing) {
      return this.prisma.centerInfo.update({
        where: { id: existing.id },
        data: dto,
      });
    }

    return this.prisma.centerInfo.create({
      data: dto,
    });
  }
}
