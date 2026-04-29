import { Injectable } from '@nestjs/common';
import { LeadRequest } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadRequestDto } from './dto/create-lead-request.dto';

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLeadRequestDto): Promise<LeadRequest> {
    return this.prisma.leadRequest.create({
      data: dto,
    });
  }

  async findAll(limit = 10): Promise<LeadRequest[]> {
    return this.prisma.leadRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
