import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async findAll(teacherId?: string) {
    return this.prisma.group.findMany({
      where: teacherId ? { teacherId } : {},
      include: {
        _count: { select: { members: true } },
        teacher: { select: { fullName: true } }
      }
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.group.findUnique({ 
      where: { id },
      include: { 
        members: { include: { student: true } },
        teacher: { select: { fullName: true } }
      }
    });
    if (!item) throw new NotFoundException('Guruh topilmadi');
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
