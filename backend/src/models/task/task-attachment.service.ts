import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';

@Injectable()
export class TaskAttachmentService {
  constructor(private prisma: PrismaService) {}

  async create(taskId: number, data: any) {
    return (this.prisma.taskAttachment as any).create({
      data: { ...data, taskId: +taskId } as any
    });
  }

  async findByTask(taskId: number) {
    return (this.prisma.taskAttachment as any).findMany({
      where: { taskId: +taskId }
    });
  }
}
