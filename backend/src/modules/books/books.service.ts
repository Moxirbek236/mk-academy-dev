import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
// Removed CefrLevel import as it is now a String in SQLite schema.

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) { }

  async findAll(cefr?: string) {
    return this.prisma.book.findMany({
      where: {
        cefrLevel: (cefr as any) || undefined,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
    });
    if (!book) throw new NotFoundException('Kitob topilmadi');
    return book;
  }

  async create(data: any) {
    return this.prisma.book.create({
      data: {
        title: data.title,
        author: data.author,
        description: data.description,
        coverImageUrl: data.coverImageUrl,
        fileUrl: data.fileUrl,
        cefrLevel: data.cefrLevel,
      }
    });
  }
}
