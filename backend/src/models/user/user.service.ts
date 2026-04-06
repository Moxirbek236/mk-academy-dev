import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserRole } from '../../core/enums';
import { join } from 'path';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async createTeacher(payload: CreateUserDto, currentUser: { id: number; role: UserRole }, filename?: string) {
    const existingUser = await this.prisma.user.findUnique({ where: { phone: payload.phone } });

    if (existingUser) {
      if (filename) {
        const filePath = join(process.cwd(), 'src', 'uploads', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      throw new BadRequestException('User already exists');
    }

    const passHash = await bcrypt.hash(payload.passwordHash, 10);

    const user = await this.prisma.user.create({
      data: {
        ...payload,
        avatarUrl: filename ?? null,
        passwordHash: passHash,
        role: UserRole.TEACHER,
      },
    });

    await this.prisma.userProfile.create({
      data: {
        userId: user.id,
      },
    });

    const token = this.jwtService.sign({
      id: user.id,
      phone: user.phone,
      role: user.role,
    });

    return {
      success: true,
      token,
    };
  }

  async createStudent(payload: CreateUserDto, currentUser: { id: number; role: UserRole }, filename?: string) {
    const existingUser = await this.prisma.user.findUnique({ where: { phone: payload.phone } });

    if (existingUser) {
      if (filename) {
        const filePath = join(process.cwd(), 'src', 'uploads', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      throw new BadRequestException('User already exists');
    }

    const passHash = await bcrypt.hash(payload.passwordHash, 10);

    const user = await this.prisma.user.create({
      data: {
        ...payload,
        avatarUrl: filename ?? null,
        passwordHash: passHash,
        role: UserRole.STUDENT,
      },
    });

    await this.prisma.userProfile.create({
      data: {
        userId: user.id,
      },
    });

    const token = this.jwtService.sign({
      id: user.id,
      phone: user.phone,
      role: user.role,
    });

    return {
      success: true,
      token,
    };
  }

  async createAdmin(payload: CreateUserDto, currentUser: { id: number; role: UserRole }, filename?: string) {
    const existingUser = await this.prisma.user.findUnique({ where: { phone: payload.phone } });

    if (existingUser) {
      if (filename) {
        const filePath = join(process.cwd(), 'src', 'uploads', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      throw new BadRequestException('User already exists');
    }

    const passHash = await bcrypt.hash(payload.passwordHash, 10);

    const user = await this.prisma.user.create({
      data: {
        ...payload,
        avatarUrl: filename ?? null,
        passwordHash: passHash,
        role: UserRole.ADMIN,
      },
    });

    await this.prisma.userProfile.create({
      data: {
        userId: user.id,
      },
    });

    const token = this.jwtService.sign({
      id: user.id,
      phone: user.phone,
      role: user.role,
    });

    return {
      success: true,
      token,
    };
  }

  async findAllSuperAdmin(currentUser: { id: number; role: UserRole }) {
    // Implementation for finding all super admins
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id: +id },
      include: { profile: true },
    });
  }

  async update(id: number, dto: UpdateUserDto) {
    const updateData: any = { ...dto };
    if (dto.passwordHash) {
      updateData.passwordHash = await bcrypt.hash(dto.passwordHash, 10);
    }

    return this.prisma.user.update({
      where: { id: +id },
      data: updateData,
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({ where: { id: +id } });
  }
}

