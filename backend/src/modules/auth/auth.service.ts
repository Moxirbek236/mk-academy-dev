import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Email yoki parol noto\'g\'ri');
    
    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Email yoki parol noto\'g\'ri');

    const payload = { id: user.id, email: user.email, role: user.role };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      }
    };
  }

  async signUp(data: any): Promise<any> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.usersService.create({
      ...data,
      passwordHash: hashedPassword,
    });

    const payload = { id: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      }
    };
  }
}
