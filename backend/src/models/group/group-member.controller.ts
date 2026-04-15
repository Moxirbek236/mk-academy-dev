import { Controller, Post, Delete, Get, Param, Body, UseGuards } from '@nestjs/common';
import { GroupMemberService } from './group-member.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/core/enums';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';

@ApiBearerAuth()
@ApiTags('group-members')
@UseGuards(AuthGuard, RolesGuard)
@Controller('group-members')
export class GroupMemberController {
  constructor(private readonly service: GroupMemberService) { }

  @ApiOperation({ summary: `${UserRole.SUPERADMIN}, ${UserRole.ADMIN} — Student guruhga qo'shish` })
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @Post(':groupId/add/:studentId')
  add(@Param('groupId') groupId: string, @Param('studentId') studentId: string) {
    return this.service.addMember(+groupId, +studentId);
  }

  @ApiOperation({ summary: `${UserRole.SUPERADMIN}, ${UserRole.ADMIN} — Student guruhdan chiqarish` })
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @Delete(':groupId/remove/:studentId')
  remove(@Param('groupId') groupId: string, @Param('studentId') studentId: string) {
    return this.service.removeMember(+groupId, +studentId);
  }

  @ApiOperation({ summary: `${UserRole.SUPERADMIN}, ${UserRole.ADMIN}, ${UserRole.TEACHER} — Guruh a'zolarini ko'rish` })
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.TEACHER)
  @Get(':groupId')
  findAll(@Param('groupId') groupId: string) {
    return this.service.findMembers(+groupId);
  }
}
