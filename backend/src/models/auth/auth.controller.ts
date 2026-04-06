import { Controller, Post, Body, Request} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';

import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  @ApiOperation({ summary: 'Login with phone and password' })
  async login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout current user' })
  async logout(@Request() req: any) {
    return { message: 'Logged out' };
  }
}
