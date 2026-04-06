import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryTeacherDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fullName?: string;
}
