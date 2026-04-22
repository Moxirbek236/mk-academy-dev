import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, UploadedFile, Req, Put, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  UpdateCurrentProfileDto,
  UpdateUserDto,
  QueryUserDto,
  QueryUserSuperAdminDto,
} from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UserRole } from 'src/core/enums';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { QueryUserAdminDto } from './dto/query.admin.dto';
import { QueryUserTeacherDto } from './dto/query.teacher.dto';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: `${UserRole.SUPERADMIN}, ${UserRole.ADMIN}` })
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @Post("create/teacher")
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phone: { type: 'string', example: '+998XXXXXXXXX' },
        passwordHash: { type: 'string' },
        fullName: { type: 'string' },
        avatarUrl: { type: 'string', format: 'binary' },
        cefrLevel: { type: 'string', enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('avatarUrl', {
      storage: diskStorage({
        destination: './src/uploads',
        filename: (req, file, callback) => {
          const filename = Date.now() + '.' + file.originalname.split('.')[1];
          callback(null, filename);
        },
      }),
    }),
  )
  createTeacher(@Body() payload: CreateUserDto, @Req() req: Request, @UploadedFile() file?: any) {
    return this.userService.createTeacher(payload, req['user'], file?.filename);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: `${UserRole.SUPERADMIN}, ${UserRole.ADMIN}` })
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @Post("create/student")
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phone: { type: 'string', example: '+998XXXXXXXXX' },
        passwordHash: { type: 'string' },
        fullName: { type: 'string' },
        avatarUrl: { type: 'string', format: 'binary' },
        cefrLevel: { type: 'string', enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('avatarUrl', {
      storage: diskStorage({
        destination: './src/uploads',
        filename: (req, file, callback) => {
          const filename = Date.now() + '.' + file.originalname.split('.')[1];
          callback(null, filename);
        },
      }),
    }),
  )
  createStudent(@Body() payload: CreateUserDto, @Req() req: Request, @UploadedFile() file?: any) {
    return this.userService.createStudent(payload, req['user'], file?.filename);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: `${UserRole.SUPERADMIN}` })
  @Roles(UserRole.SUPERADMIN)
  @Post("create/admin")
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phone: { type: 'string', example: '+998XXXXXXXXX' },
        passwordHash: { type: 'string' },
        fullName: { type: 'string' },
        avatarUrl: { type: 'string', format: 'binary' },
        cefrLevel: { type: 'string', enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('avatarUrl', {
      storage: diskStorage({
        destination: './src/uploads',
        filename: (req, file, callback) => {
          const filename = Date.now() + '.' + file.originalname.split('.')[1];
          callback(null, filename);
        },
      }),
    }),
  )
  createAdmin(@Body() payload: CreateUserDto, @Req() req: Request, @UploadedFile() file?: any) {
    return this.userService.createAdmin(payload, req['user'], file?.filename);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: `${UserRole.SUPERADMIN}` })
  @Roles(UserRole.SUPERADMIN)
  @Get("superAdmin/getAllRoles")
  findAllSuperAdmin(@Req() req: Request, @Query() query: QueryUserSuperAdminDto) {
    return this.userService.findAllSuperAdmin(query);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get users list for the current authenticated role' })
  @Get()
  findAll(@Req() req: Request, @Query() query: QueryUserSuperAdminDto) {
    return this.userService.findAll(req['user'], query);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @Get('profile')
  getProfile(@Req() req: Request) {
    return this.userService.getCurrentProfile(req['user']);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update current user profile' })
  @Patch('profile')
  updateProfile(@Req() req: Request, @Body() payload: UpdateCurrentProfileDto) {
    return this.userService.updateCurrentProfile(req['user'], payload);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: `${UserRole.ADMIN}` })
  @Roles(UserRole.ADMIN)
  @Get("admin/getAll_Students_And_Techers")
  findAllAdmin(@Req() req: Request, @Query() query: QueryUserAdminDto) {
    return this.userService.findAllAdmin(query);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: `${UserRole.TEACHER}` })
  @Roles(UserRole.TEACHER)
  @Get("teacher/getAll_Students")
  findAllTeacher(@Req() req: Request, @Query() query: QueryUserTeacherDto) {
    return this.userService.findAllTeacher(req['user'], query);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: `${UserRole.SUPERADMIN}, ${UserRole.ADMIN}, ${UserRole.TEACHER}` })
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.TEACHER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.userService.findOne(id, req['user']);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: `${UserRole.SUPERADMIN}, ${UserRole.ADMIN}` })
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.userService.remove(id, req['user']);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: `${UserRole.SUPERADMIN}, ${UserRole.ADMIN}` })
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @Patch('active/:id')
  active(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.userService.active(id, req['user']);
  }
}
