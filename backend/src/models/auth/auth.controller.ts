import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  @ApiOperation({ summary: 'Login with phone and password' })
  @ApiResponse({ status: 200, description: 'Login successful.' })
  async login(@Body() body: any) {
    return this.authService.validateUser(body.phone, body.password);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout current user' })
  async logout(@Request() req: any) {
    return { message: 'Logged out' };
  }
}
