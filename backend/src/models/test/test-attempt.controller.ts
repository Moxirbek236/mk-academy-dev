import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { TestAttemptService } from './test-attempt.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('test-attempts')
@Controller('test-attempts')
export class TestAttemptController {
  constructor(private readonly service: TestAttemptService) {}

  @Post('submit')
  @ApiOperation({ summary: 'Submit a test attempt' })
  @ApiResponse({ status: 201, description: 'Attempt recorded (XP awarded if passed).' })
  submit(@Body() body: { studentId: number; testId: number; score: number; passed: boolean }) {
    return this.service.submitAttempt(body.studentId, body.testId, body.score, body.passed);
  }

  @Get('student/:id')
  @ApiOperation({ summary: 'Get all attempts for a student' })
  findByStudent(@Param('id') id: string) {
    return this.service.findByStudent(+id);
  }
}
