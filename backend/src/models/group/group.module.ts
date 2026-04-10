import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { GroupMemberService } from './group-member.service';
import { GroupMemberController } from './group-member.controller';
import { GroupAssignmentService } from './group-assignment.service';
import { GroupAssignmentController } from './group-assignment.controller';
import { GroupCourseService } from './group-course.service';
import { GroupCourseController } from './group-course.controller';
import { PrismaModule } from 'src/core/config/prisma.module';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [
    GroupController,
    GroupMemberController,
    GroupAssignmentController,
    GroupCourseController,
  ],
  providers: [
    GroupService,
    GroupMemberService,
    GroupAssignmentService,
    GroupCourseService,
  ],
  exports: [GroupService, GroupMemberService, GroupAssignmentService, GroupCourseService],
})
export class GroupModule {}
