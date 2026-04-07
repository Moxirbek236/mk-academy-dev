import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';
import { CreateUserDto, QueryUserDto, UpdateUserDto } from './dto';
import { User } from '@prisma/client';
import { UserRole } from 'src/core/enums';
import { join } from 'path';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { group } from 'console';
import { QueryUserTeacherDto } from './dto/query.teacher.dto';
import { QueryUserAdminDto } from './dto/query.admin.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) { }

  async createTeacher(payload: CreateUserDto, currentUser: { id: number, role: UserRole }, filename?: string) {

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
      },
      select:{
        id:true,
        fullName:true,
        phone:true,
        role:true,
        isActive:true,
        createdAt:true,
        updatedAt:true,
      }
    })

    await this.prisma.userProfile.create({
      data: {
        userId: user.id,
        isActive: true,
      }
    })

    return {
      success: true,
      message: `${UserRole.TEACHER} created successfully`
    }
  }

  async createStudent(payload: CreateUserDto, currentUser: { id: number, role: UserRole }, filename?: string) {

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

    //User profile yaratiladi bir vaqtda
    await this.prisma.userProfile.create({
      data: {
        userId: user.id
      }
    })

    return {
      success: true,
      message: `${UserRole.STUDENT} created successfully`
    }
  }

  async createAdmin(payload: CreateUserDto, currentUser: { id: number, role: UserRole }, filename?: string) {

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

    return {
      success: true,
      message: `${UserRole.ADMIN} created successfully`,
    }
  }

  async findAllSuperAdmin(query: QueryUserDto): Promise<User[]> {
    try {
      let users = await this.prisma.user.findMany({
        where: {
        },
        include: {
          groupsCreated: true
        }
      });

      if (query.fullName) {
        const search = query.fullName.toLowerCase();
        users = users.filter(user =>
          user.fullName.toLowerCase().includes(search),
        );
      }

      if (query.GroupName) {
        const groupSearch = query.GroupName.toLowerCase();
        users = users.filter(user =>
          user.groupsCreated.some(group =>
            group.name.toLowerCase().includes(groupSearch),
          ),
        );
      }

      if (query.user) {
        users = users.filter(user => user.role === query.user);
      }

      if (query.isActive !== undefined) {
        users = users.filter(user => user.isActive === query.isActive);
      }

      users = users.map(user => {
        if (user.role === 'STUDENT' || user.role === 'TEACHER' || user.role === 'ADMIN') {
          return {
            ...user, groupsCreated: []
          };
        }
        return user;
      });

      return users;
    } catch (err) {
      console.error('findAllSuperAdmin error:', err);
      throw new BadRequestException(
        'Invalid query parameters or database error',
      );
    }
  }
  async findAllAdmin(query: QueryUserAdminDto) {
    try {
      let users = await this.prisma.user.findMany({
        where: {
          role: {
            notIn: [UserRole.ADMIN, UserRole.SUPERADMIN]
          },
        },
        include: {
          groupsCreated: true
        },
      });

      if (query.fullName) {
        const search = query.fullName.toLowerCase();
        users = users.filter(user =>
          user.fullName.toLowerCase().includes(search),
        );
      }

      if (query.GroupName) {
        const groupSearch = query.GroupName.toLowerCase();
        users = users.filter(user =>
          user.groupsCreated.some(group =>
            group.name.toLowerCase().includes(groupSearch),
          ),
        );
      }

      if (query.user) {
        users = users.filter(user => user.role === query.user);
      }

      if (query.isActive !== undefined) {
        users = users.filter(user => user.isActive === query.isActive);
      }

      users = users.map(user => {
        if (user.role === 'STUDENT' || user.role === 'TEACHER') {
          return { ...user, groupsCreated: [] };
        }
        return user;
      });

      return users;
    } catch (err) {
      console.error('findAllSuperAdmin error:', err);
      throw new BadRequestException(
        'Invalid query parameters or database error',
      );
    }
  }

  async findAllTeacher(currentUser: { id: number }, query: QueryUserTeacherDto) {
    try {
      let users = await this.prisma.user.findMany({
        where: {
          isActive: true,
          role: UserRole.TEACHER
        }
      });

      if (query.fullName) {
        const search = query.fullName.toLowerCase();
        users = users.filter(user =>
          user.fullName.toLowerCase().includes(search),
        );
      }

      return users;
    } catch (err) {
      throw new BadRequestException(
        'Invalid query parameters or database error',
      );
    }

  }

  async findOne(id: number, currentUser: { id: number, role: UserRole }) {
    if (currentUser.role === UserRole.SUPERADMIN) {
      return await this.prisma.user.findUnique({ where: { id: id }, include: { groupsCreated: true } });
    }
    if (currentUser.role === UserRole.ADMIN) {
      return this.prisma.user.findFirst({
        where: {
          id,
          role: {
            notIn: [UserRole.ADMIN, UserRole.SUPERADMIN],
          },
        },
        include: { groupsCreated: true },
      });
    }

    return await this.prisma.user.findUnique({ where: { id: id, groupsCreated: { some: { teacherId: currentUser.id } } } });
  }

  async remove(id: number, currentUser: { id: number; role: UserRole }) {

    const user = await this.prisma.user.findFirst({
      where: { id, isActive: true },
    });

    if (!user || !user.isActive) {
      throw new BadRequestException('User not found or already deleted');
    }

    if (currentUser.id === id) {
      throw new ForbiddenException('You cannot delete yourself');
    }

    if (currentUser.role === UserRole.SUPERADMIN) {
      return await this.prisma.user.update({
        where: { id },
        data: { isActive: false },
      });
    }

    if (currentUser.role === UserRole.ADMIN) {
      if (
        user.role === UserRole.ADMIN ||
        user.role === UserRole.SUPERADMIN
      ) {
        throw new ForbiddenException(
          'Admin cannot delete admin or super admin',
        );
      }

      await this.prisma.userProfile.update({
        where: { userId: id },
        data: { isActive: false },
      });

      await this.prisma.user.update({
        where: { id },
        data: { isActive: false },
      });

      return {
        success: true,
        message: 'User deleted successfully'
      };
    }
    throw new ForbiddenException('Access denied');
  }

  async active(id: number, currentUser: { id: number; role: UserRole }) {

    const user = await this.prisma.user.findFirst({
      where: { id, isActive: false }
    });

    if (!user) {
      throw new BadRequestException('User not found or already active');
    }

    if (currentUser.id === id) {
      throw new ForbiddenException('You cannot activate yourself');
    }

    if (currentUser.role === UserRole.SUPERADMIN) {
      await this.prisma.userProfile.update({
        where: { userId: id },
        data: { isActive: true },
      })
      await this.prisma.user.update({
        where: { id },
        data: { isActive: true },
      });

      return {
        success: true,
        message: 'User activated successfully'
      };
    }

    if (currentUser.role === UserRole.ADMIN) {
      if (
        user.role === UserRole.ADMIN ||
        user.role === UserRole.SUPERADMIN
      ) {
        throw new ForbiddenException(
          'Admin cannot active admin or super admin',
        );
      }

      await this.prisma.userProfile.update({
        where: { userId: id },
        data: { isActive: true },
      })

      await this.prisma.user.update({
        where: { id },
        data: { isActive: true },
      });

      return {
        success: true,
        message: 'User activated successfully'
      };
    }

    throw new ForbiddenException('Access denied');
  }
}
