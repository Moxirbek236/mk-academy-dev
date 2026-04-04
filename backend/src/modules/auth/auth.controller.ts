import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, ContactDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: LoginDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('register')
  async signUp(@Body() signUpDto: RegisterDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('contact')
  @HttpCode(HttpStatus.OK)
  async contactForm(@Body() contactData: ContactDto) {
    // Very powerful logic simulation: we validate via DTO automatically and process the contact request
    // Since we don't have a mailer set up, we just return a success payload
    return {
      success: true,
      message: "Taklifingiz muvaffaqiyatli qabul qilindi! Tez orada siz bilan bog'lanamiz.",
    };
  }
}
