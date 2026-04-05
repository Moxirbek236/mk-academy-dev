import { Controller, Post, Delete, Get, Param } from '@nestjs/common';
import { GroupCourseService } from './group-course.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('group-courses')
@Controller('group-courses')
export class GroupCourseController {
  constructor(private readonly service: GroupCourseService) {}

  @Post(':groupId/course/:courseId')
  @ApiOperation({ summary: 'Assign a course to a group' })
  assign(@Param('groupId') groupId: string, @Param('courseId') courseId: string) {
    return this.service.assignCourse(+groupId, +courseId);
  }

  @Delete(':groupId/course/:courseId')
  @ApiOperation({ summary: 'Remove a course from a group' })
  remove(@Param('groupId') groupId: string, @Param('courseId') courseId: string) {
    return this.service.removeCourse(+groupId, +courseId);
  }

  @Get(':groupId')
  @ApiOperation({ summary: 'Get all courses for a group' })
  findAll(@Param('groupId') groupId: string) {
    return this.service.findByGroup(+groupId);
  }
}
