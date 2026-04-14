import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/core/enums';
import { CreateQuestionDto } from './dto';

@ApiTags('questions')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('test/:testId')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Add a question to a test' })
  create(
    @Param('testId', ParseIntPipe) testId: number,
    @Body() data: CreateQuestionDto,
    @Req() req: any,
  ) {
    return this.questionService.create(testId, data, req['user']);
  }

  @Get('test/:testId')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiOperation({ summary: 'Get all questions for a test' })
  findAllByTest(@Param('testId', ParseIntPipe) testId: number, @Req() req: any) {
    return this.questionService.findAllByTest(testId, req['user']);
  }

  @Patch(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Update question' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<CreateQuestionDto>,
    @Req() req: any,
  ) {
    return this.questionService.update(id, data, req['user']);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Remove question' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.questionService.remove(id, req['user']);
  }
}
