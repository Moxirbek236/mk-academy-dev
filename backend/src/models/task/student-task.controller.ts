import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { StudentTaskService } from './student-task.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('student-tasks')
@Controller('student-tasks')
export class StudentTaskController {
  constructor(private readonly service: StudentTaskService) {}

  @Post('submit/:studentId/:taskId')
  @ApiOperation({ summary: 'Submit a student task' })
  submit(@Param('studentId') studentId: string, @Param('taskId') taskId: string, @Body() body: { submissionUrl: string }) {
    return this.service.submitTask(+studentId, +taskId, body.submissionUrl);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get all tasks for a student' })
  findAll(@Param('studentId') studentId: string) {
    return this.service.findByStudent(+studentId);
  }
}
