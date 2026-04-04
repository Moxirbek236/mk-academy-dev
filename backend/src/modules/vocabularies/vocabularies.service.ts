import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VocabularysService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.vocabulary.findMany();
  }

  async findOne(id: string) {
    const item = await this.prisma.vocabulary.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Topilmadi');
    return item;
  }

  async create(data: any) {
    return this.prisma.vocabulary.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.vocabulary.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.vocabulary.delete({ where: { id } });
  }
}
