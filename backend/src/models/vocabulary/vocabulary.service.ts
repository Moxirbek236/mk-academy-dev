import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';
import { CreateVocabularyDto, UpdateVocabularyDto } from './dto';

@Injectable()
export class VocabularyService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateVocabularyDto) {
    return (this.prisma.vocabulary as any).create({ data: dto as any });
  }

  async findAll() {
    return (this.prisma.vocabulary as any).findMany();
  }

  async findOne(id: number) {
    return (this.prisma.vocabulary as any).findUnique({ where: { id: +id } });
  }

  async update(id: number, dto: UpdateVocabularyDto) {
    return (this.prisma.vocabulary as any).update({ where: { id: +id }, data: dto as any });
  }

  async remove(id: number) {
    return (this.prisma.vocabulary as any).delete({ where: { id: +id } });
  }
}
