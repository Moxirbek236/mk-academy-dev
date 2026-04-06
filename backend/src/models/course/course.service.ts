import { Body, Injectable, Post } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from './dto';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}
  @Post("create")
 async  courseCreate(@Body() payload:CreateCourseDto){

 }
}
