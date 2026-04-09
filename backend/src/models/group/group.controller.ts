import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto, UpdateGroupDto } from './dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/core/enums';

@ApiTags('groups')
@ApiBearerAuth()
@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.TEACHER)
  @Post()
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({ status: 201, description: 'Group created successfully.' })
  create(@Req() req: any, @Body() dto: CreateGroupDto) {
    return this.groupService.create(req['user'], dto);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all groups' }) 
  findAll(@Req() req: any, @Query('name') name?: string) {
    return this.groupService.findAll(req['user'], name);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get group by ID' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.groupService.findOne(+id, req['user']);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.TEACHER)
  @Patch(':id')
  @ApiOperation({ summary: 'Update group' })
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateGroupDto) {
    return this.groupService.update(+id, req['user'], dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.TEACHER)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete group' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.groupService.remove(+id, req['user']);
  }
}
