import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserRole } from 'src/core/enums';
import { join } from 'path';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async createTeacher(payload: CreateUserDto, currentUser:{id: number, role: UserRole}, filename?: string) {

    const phone = await this.prisma.user.findUnique({ where: { phone: payload.phone } });

    if (phone) {
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
          role: UserRole.TEACHER
        }
      })

      await this.prisma.userProfile.create({
        data: {
          userId: user.id,
        }
      })

      const token = this.jwtService.sign({
      id: user.id,
      phone: user.phone,
      role: user.role
    })

    return {
      success: true,
      token
    }
  }

  async createStudent(payload: CreateUserDto, currentUser:{id: number, role: UserRole}, filename?: string) {

    const phone = await this.prisma.user.findUnique({ where: { phone: payload.phone } });

    if (phone) {
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
          role: UserRole.STUDENT
        }
      })

      await this.prisma.userProfile.create({
        data: {
          userId: user.id,
        }
      })

      const token = this.jwtService.sign({
      id: user.id,
      phone: user.phone,
      role: user.role
    })

    return {
      success: true,
      token
    }
  }

  async createAdmin(payload: CreateUserDto, currentUser:{id: number, role: UserRole}, filename?: string) {

    const phone = await this.prisma.user.findUnique({ where: { phone: payload.phone } });

    if (phone) {
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
          role: UserRole.ADMIN
        }
      })

      await this.prisma.userProfile.create({
        data: {
          userId: user.id,
        }
      })

      const token = this.jwtService.sign({
      id: user.id,
      phone: user.phone,
      role: user.role
    })

    return {
      success: true,
      token
    }
  }
  

  async findAllSuperAdmin(currentUser:{id: number, role: UserRole}) {
    
  }

  async findOne(id: number) {
    return (this.prisma.user as any).findUnique({ where: { id: +id }, include: { profile: true } });
  }

  async update(id: number, dto: UpdateUserDto) {

    if (dto.passwordHash) {
      const passHash = await bcrypt.hash(dto.passwordHash, 10);
      dto.passwordHash = passHash;
    }

    return (this.prisma.user as any).update({ where: { id: +id }, data: dto });
  }

  async remove(id: number) {
    return (this.prisma.user as any).delete({ where: { id: +id } });
  }
}
