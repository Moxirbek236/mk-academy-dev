import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';
import { CreateGroupDto, UpdateGroupDto } from './dto';

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService) { }

  async create(payload: CreateGroupDto) {

    //check teacher is exists
    const checkTeacherId = await this.prisma.user.findFirst({ where: { id: payload.teacherId, isActive: true, role: "TEACHER" } });
    if (!checkTeacherId) {
      throw new NotFoundException('Bunday o\'qituvchi mavjud emas');
    }

    //check unique invite code
    const checkUniqueInviteCode = await this.prisma.group.findFirst({ where: { inviteCode: payload.inviteCode } });
    if (checkUniqueInviteCode) {
      throw new BadRequestException('Bunday taklif kodi allaqachon mavjud');
    }
    const group = await this.prisma.group.create({
      data: {
        name: payload.name,
        description: payload?.description,
        teacherId: payload.teacherId,
        inviteCode: payload.inviteCode
      }
    });
    return {
      message: "Guruh muvaffaqiyatli yaratildi",
      data: group
    }
  }

  async findAll() {
    return await this.prisma.group.findMany();
  }

  async findOne(id: number) {
    const group = await this.prisma.group.findUnique({ where: { id }, include: { teacher: true, members: true } });
    if (!group) {
      throw new NotFoundException('Bunday guruh mavjud emas');
    }
    if (!group.isActive) {
      throw new NotFoundException('Bu guruh faol emas');
    }
    return group;
  }

  async update(id: number, dto: UpdateGroupDto) {
    const checkGroupId = await this.prisma.group.findFirst({ where: { id } });
    if (!checkGroupId) {
      throw new NotFoundException('Bunday guruh mavjud emas');
    }
    return this.prisma.group.update({ where: { id }, data: dto as any });
  }

  async remove(id: number) {
    const group = await this.prisma.group.findFirst({ where: { id } });
    if (!group) {
      throw new NotFoundException('Bunday guruh mavjud emas');
    }
    if (!group.isActive) {
      throw new BadRequestException('Bu guruh allaqachon o\'chirilgan');
    }
    return this.prisma.group.update({
      where: { id },
      data: { isActive: false }
    });
  }
}
