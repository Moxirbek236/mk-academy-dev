import { Controller, Post, Delete, Get, Param, Body } from '@nestjs/common';
import { GroupMemberService } from './group-member.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('group-members')
@Controller('group-members')
export class GroupMemberController {
  constructor(private readonly service: GroupMemberService) {}

  @Post(':groupId/add/:studentId')
  @ApiOperation({ summary: 'Add a student to a group' })
  add(@Param('groupId') groupId: string, @Param('studentId') studentId: string) {
    return this.service.addMember(+groupId, +studentId);
  }

  @Delete(':groupId/remove/:studentId')
  @ApiOperation({ summary: 'Remove a student from a group' })
  remove(@Param('groupId') groupId: string, @Param('studentId') studentId: string) {
    return this.service.removeMember(+groupId, +studentId);
  }

  @Get(':groupId')
  @ApiOperation({ summary: 'Get all members of a group' })
  findAll(@Param('groupId') groupId: string) {
    return this.service.findMembers(+groupId);
  }
}
