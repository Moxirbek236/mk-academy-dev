import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { GroupAssignmentService } from './group-assignment.service';

@Controller('group-assignments')
export class GroupAssignmentController {
  constructor(private readonly service: GroupAssignmentService) {}

  @Post()
  assign(@Body() body: { groupId: number; taskId?: number; testId?: number }) {
    return this.service.assign(body.groupId, body.taskId, body.testId);
  }

  @Get('group/:id')
  findByGroup(@Param('id') id: string) {
    return this.service.findByGroup(+id);
  }
}
