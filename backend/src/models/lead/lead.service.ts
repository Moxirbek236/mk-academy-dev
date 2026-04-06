import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';
import { CreateLeadDto, UpdateLeadStatusDto } from './dto';

@Injectable()
export class LeadService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLeadDto) {
    return this.prisma.lead.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: number, dto: UpdateLeadStatusDto) {
    return this.prisma.lead.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async remove(id: number) {
    return this.prisma.lead.delete({
      where: { id },
    });
  }
}
