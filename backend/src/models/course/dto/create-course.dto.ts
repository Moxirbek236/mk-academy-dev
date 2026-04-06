import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsUrl, IsEnum } from 'class-validator';
import { CefrLevel } from '../../../core/enums';

export class CreateCourseDto {
  @ApiProperty({ example: 'Elementary English (A1)' })
  @IsString()
  title!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: CefrLevel, description: 'CEFR level (A1-C2)' })
  @IsEnum(CefrLevel)
  level!: CefrLevel;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
