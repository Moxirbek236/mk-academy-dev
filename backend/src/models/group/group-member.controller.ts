import { Controller, Post, Delete, Get, Param, Body } from '@nestjs/common';
import { GroupMemberService } from './group-member.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/core/enums';

@ApiBearerAuth()
@ApiTags('group-members')
@Controller('group-members')
export class GroupMemberController {
  constructor(private readonly service: GroupMemberService) { }

  @ApiOperation({ summary: `${UserRole.SUPERADMIN}, ${UserRole.ADMIN}` })
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @Post(':groupId/add/:studentId')
  @ApiOperation({ summary: 'Add a student to a group' })
  add(@Param('groupId') groupId: string, @Param('studentId') studentId: string) {
    return this.service.addMember(+groupId, +studentId);
  }

  @ApiOperation({ summary: `${UserRole.SUPERADMIN}, ${UserRole.ADMIN}` })
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @Delete(':groupId/remove/:studentId')
  @ApiOperation({ summary: 'Remove a student from a group' })
  remove(@Param('groupId') groupId: string, @Param('studentId') studentId: string) {
    return this.service.removeMember(+groupId, +studentId);
  }

  @ApiOperation({ summary: `${UserRole.SUPERADMIN}, ${UserRole.ADMIN}` })
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @Get(':groupId')
  @ApiOperation({ summary: 'Get all members of a group' })
  findAll(@Param('groupId') groupId: string) {
    return this.service.findMembers(+groupId);
  }
}
