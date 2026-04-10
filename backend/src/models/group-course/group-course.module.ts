import { Module } from '@nestjs/common';
import { GroupCourseService } from './group-course.service';
import { GroupCourseController } from './group-course.controller';

@Module({
  controllers: [GroupCourseController],
  providers: [GroupCourseService],
})
export class GroupCourseModule {}
