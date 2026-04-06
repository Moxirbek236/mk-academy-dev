import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto, UpdateCourseDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { title } from 'process';
import { CefrLevel, UserRole } from 'src/core/enums';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('courses')
@ApiBearerAuth()
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

   @UseGuards(AuthGuard, RolesGuard)
    @ApiOperation({ summary: `${UserRole.SUPER_ADMIN}, ${UserRole.ADMIN}` })
    @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        title: { type: 'string', example: "" },
        description: { type: 'string', example: "" },
        level: { type: 'string',enum:Object.values(CefrLevel), example: CefrLevel.A1 },
        imageUrl: { type: 'string', format: "binary" },
        isActive:{type:'string', example:"true"}
      },
      required:["title","level"]
    }
  })
  @Post("create")
  @UseInterceptors(FileInterceptor('imageUrl', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueName =
          Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + extname(file.originalname));
      },
    }),
  }))
  async createCourse(
    @Body() payload: CreateCourseDto, 
    @UploadedFile() file?: Express.Multer.File, 
  ) {
    if (file) {
      payload.imageUrl = file.filename
    }
    return this.courseService.createCourse(payload)
  }
}
