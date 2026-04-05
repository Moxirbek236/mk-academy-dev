import { Controller, Post, Body, UseGuards, Request, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  @ApiOperation({ summary: 'Login with phone and password' })
  @ApiResponse({ status: 200, description: 'Login successful.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.phone, body.password);
    if (!user) {
      throw new UnauthorizedException('Phone number or password incorrect');
    }
    return user;
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout current user' })
  async logout(@Request() req: any) {
    return { message: 'Logged out' };
  }
}
