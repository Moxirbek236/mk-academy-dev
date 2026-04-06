import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { TaskAttachmentService } from './task-attachment.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('task-attachments')
@Controller('task-attachments')
export class TaskAttachmentController {
  constructor(private readonly service: TaskAttachmentService) {}

  @Post('task/:taskId')
  @ApiOperation({ summary: 'Add attachment to a task' })
  create(@Param('taskId') taskId: string, @Body() data: any) {
    return this.service.create(+taskId, data);
  }

  @Get('task/:taskId')
  @ApiOperation({ summary: 'Get all attachments for a task' })
  findAll(@Param('taskId') taskId: string) {
    return this.service.findByTask(+taskId);
  }
}
