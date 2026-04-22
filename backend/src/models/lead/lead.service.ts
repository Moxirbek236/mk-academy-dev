import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';
import { CreateLeadDto, UpdateLeadAnswerDto, UpdateLeadStatusDto } from './dto';

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

  async findPublishedQuestions() {
    return this.prisma.lead.findMany({
      where: {
        isActive: true,
        isPublished: true,
        message: { not: null },
        answer: { not: null },
      },
      orderBy: { answeredAt: 'desc' },
      take: 12,
      select: {
        id: true,
        fullName: true,
        message: true,
        answer: true,
        answeredAt: true,
        createdAt: true,
      },
    });
  }

  async updateStatus(id: number, dto: UpdateLeadStatusDto) {
    return this.prisma.lead.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async updateAnswer(id: number, dto: UpdateLeadAnswerDto) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    const answer = dto.answer.trim();
    const isPublished = Boolean(dto.isPublished ?? true);

    return this.prisma.lead.update({
      where: { id },
      data: {
        answer,
        isPublished,
        answeredAt: new Date(),
        status: lead?.status === 'NEW' ? 'CONTACTED' : undefined,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.lead.delete({
      where: { id },
    });
  }
}
