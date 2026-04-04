import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: { profile: true },
    });
  }

  async count() {
    return this.prisma.user.count();
  }

  async create(data: any) {
    const exists = await this.findByEmail(data.email);
    if (exists) throw new ConflictException('Bu email bilan foydalanuvchi allaqachon mavjud');

    return this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        fullName: data.fullName,
        role: data.role || 'STUDENT',
        profile: {
          create: {
            phone: data.phone,
          }
        }
      },
    });
  }
}
