import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.group.findMany();
  }

  async findOne(id: string) {
    const item = await this.prisma.group.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Topilmadi');
    return item;
  }

  async create(data: any) {
    return this.prisma.group.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.group.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.group.delete({ where: { id } });
  }
}
