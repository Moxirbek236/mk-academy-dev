import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';
import { CreateRatingDto } from './dto';

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRatingDto) {
    return (this.prisma.rating as any).create({ data: dto as any });
  }

  async findAll() {
    return (this.prisma.rating as any).findMany();
  }

  async findByTarget(targetType: string, targetId: string) {
    return (this.prisma.rating as any).findMany({ where: { targetType, targetId } });
  }

  async remove(id: number) {
    return (this.prisma.rating as any).delete({ where: { id: +id } });
  }
}
