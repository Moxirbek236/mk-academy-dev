import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateNotificationDto) {
    return (this.prisma.notification as any).create({ data: dto as any });
  }

  async findAllByUser(userId: number) {
    return (this.prisma.notification as any).findMany({ where: { userId: +userId } });
  }

  async markAsRead(id: number) {
    return (this.prisma.notification as any).update({ 
      where: { id: +id }, 
      data: { isRead: true } 
    });
  }

  async remove(id: number) {
    return (this.prisma.notification as any).delete({ where: { id: +id } });
  }
}
