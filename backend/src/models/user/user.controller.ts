import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, UploadedFile, Req, Put, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, QueryUserDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UserRole } from 'src/core/enums';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

type UploadedAvatarFile = {
  filename: string;
};

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: `${UserRole.SUPER_ADMIN}, ${UserRole.ADMIN}` })
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Post("create/teacher")
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phone: { type: 'string', example:'+998XXXXXXXXX' },
        password: { type: 'string' },
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
  createTeacher(@Body() payload: CreateUserDto, @Req() req: Request ,@UploadedFile() file?: UploadedAvatarFile) {
    return this.userService.createTeacher(payload, req['user'], file?.filename);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: `${UserRole.SUPER_ADMIN}, ${UserRole.ADMIN}` })
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Post("create/student")
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phone: { type: 'string', example:'+998XXXXXXXXX' },
        password: { type: 'string' },
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
  createStudent(@Body() payload: CreateUserDto, @Req() req: Request ,@UploadedFile() file?: UploadedAvatarFile) {
    return this.userService.createStudent(payload, req['user'], file?.filename);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: `${UserRole.SUPER_ADMIN}` })
  @Roles(UserRole.SUPER_ADMIN)
  @Post("create/admin")
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phone: { type: 'string', example:'+998XXXXXXXXX' },
        password: { type: 'string' },
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
  createAdmin(@Body() payload: CreateUserDto, @Req() req: Request ,@UploadedFile() file?: UploadedAvatarFile) {
    return this.userService.createAdmin(payload, req['user'], file?.filename);
  }
  
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: `${UserRole.SUPER_ADMIN}` })
  @Roles(UserRole.SUPER_ADMIN)
  @Get("superAdmin/all")
  findAllSuperAdmin(@Req() req: Request, @Query() query: QueryUserDto) {
    // return this.userService.findAllSuperAdmin(req['user'], query);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: `${UserRole.SUPER_ADMIN}` })
  @Roles(UserRole.SUPER_ADMIN)
  @Get("admin/all")
  findAllAdmin(@Req() req: Request, @Query() query: QueryUserDto) {
    // return this.userService.findAllAdmin(req['user'], query);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: `${UserRole.SUPER_ADMIN}` })
  @Roles(UserRole.SUPER_ADMIN)
  @Get("teacher/all")
  findAllTeacher(@Req() req: Request, @Query() query: QueryUserDto) {
    // return this.userService.findAllTeacher(req['user'], query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find user by ID' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Put(":id")
  @ApiOperation({ summary: 'Update user' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
