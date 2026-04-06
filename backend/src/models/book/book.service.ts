import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';
import { CreateBookDto, UpdateBookDto } from './dto';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBookDto) {
    return (this.prisma.book as any).create({ data: dto as any });
  }

  async findAll() {
    return (this.prisma.book as any).findMany();
  }

  async findOne(id: number) {
    return (this.prisma.book as any).findUnique({ where: { id: +id } });
  }

  async update(id: number, dto: UpdateBookDto) {
    return (this.prisma.book as any).update({ where: { id: +id }, data: dto as any });
  }

  async remove(id: number) {
    return (this.prisma.book as any).delete({ where: { id: +id } });
  }
}
