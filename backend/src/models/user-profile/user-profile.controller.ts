import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { CreateUserProfileDto, UpdateUserProfileDto } from './dto';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('user-profiles')
@Controller('user-profiles')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get user profile by user ID' })
  @ApiResponse({ status: 200, description: 'Return the profile.' })
  findOne(@Param('userId') userId: string) {
    return this.userProfileService.findByUserId(+userId);
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated.' })
  update(@Param('userId') userId: string, @Body() dto: UpdateUserProfileDto) {
    return this.userProfileService.update(+userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete profile (Admin only)' })
  remove(@Param('id') id: string) {
    return this.userProfileService.remove(+id);
  }
}
