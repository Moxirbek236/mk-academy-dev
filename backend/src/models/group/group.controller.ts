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
  create(@Body() dto: CreateGroupDto) {
    return this.groupService.create(dto);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all groups' }) 
  findAll(@Query('name') name?: string) {
    return this.groupService.findAll(name);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get group by ID' })
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(+id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.TEACHER)
  @Patch(':id')
  @ApiOperation({ summary: 'Update group' })
  update(@Param('id') id: string, @Body() dto: UpdateGroupDto) {
    return this.groupService.update(+id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.TEACHER)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete group' })
  remove(@Param('id') id: string) {
    return this.groupService.remove(+id);
  }
}
