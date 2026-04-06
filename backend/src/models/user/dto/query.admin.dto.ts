import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { UserRole } from '../../../core/enums';

export class QueryAdminDto {

  @ApiPropertyOptional({ enum: [UserRole.STUDENT, UserRole.TEACHER] })
  @IsOptional()
  @IsEnum(UserRole)
  user!: UserRole;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  GroupName?: string;
}
