import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';
import { CreateGroupDto, UpdateGroupDto } from './dto';

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateGroupDto) {
    return this.prisma.group.create({ data: dto as any });
  }

  async findAll() {
    return this.prisma.group.findMany({ include: { teacher: true, members: true } });
  }

  async findOne(id: number) {
    return this.prisma.group.findUnique({ where: { id }, include: { teacher: true, members: true } });
  }

  async update(id: number, dto: UpdateGroupDto) {
    return this.prisma.group.update({ where: { id }, data: dto as any });
  }

  async remove(id: number) {
    return this.prisma.group.delete({ where: { id } });
  }
}
