import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { QueryCourseDto } from './dto/query-course.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CefrLevel, UserRole } from 'src/core/enums';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('courses')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post('create')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: `Create a course (SUPERADMIN, ADMIN)` })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'English Basics' },
        description: { type: 'string', example: 'Beginner course' },
        level: { type: 'string', enum: Object.values(CefrLevel), example: CefrLevel.A1 },
        imageUrl: { type: 'string', format: 'binary' },
        isActive: { type: 'boolean', example: true },
      },
      required: ['title', 'level'],
    },
  })
  @UseInterceptors(
    FileInterceptor('imageUrl', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  async createCourse(
    @Body() payload: CreateCourseDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) payload.imageUrl = file.filename;
    return this.courseService.createCourse(payload);
  }

  @Patch(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: `Update a course (SUPERADMIN, ADMIN)` })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: '' },
        description: { type: 'string', example: '' },
        level: { type: 'string', enum: Object.values(CefrLevel) },
        imageUrl: { type: 'string', format: 'binary' },
        isActive: { type: 'boolean', example: true },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('imageUrl', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  async updateCourse(
    @Param('id',ParseIntPipe) id: number,
    @Body() payload: UpdateCourseDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) payload.imageUrl = file.filename;
    return this.courseService.updateCourse(id, payload);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: `Delete a course (SUPERADMIN, ADMIN)` })
  async deleteCourse(@Param('id',ParseIntPipe) id: number) {
    return this.courseService.deleteCourseById(id);
  }

  @Get()
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiOperation({ summary: 'Get all courses (all roles)' })
  async getAllCourses(@Query() query: QueryCourseDto) {
    return this.courseService.getAllCourses(query);
  }

  @Get(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiOperation({ summary: 'Get one course by ID (all roles)' })
  async getOneCourse(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.getOneCourseById(id);
  }
}