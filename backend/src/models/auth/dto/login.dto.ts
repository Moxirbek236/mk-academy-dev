import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Phone number of the user', example: '+998901234567' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ description: 'User password', example: 'p@ssword123' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ description: 'Device information (optional)', required: false })
  @IsString()
  deviceInfo?: string;
}
