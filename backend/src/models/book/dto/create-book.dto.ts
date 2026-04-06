import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsUrl, IsEnum } from 'class-validator';
import { CefrLevel } from '../../../core/enums';

export class CreateBookDto {
  @ApiProperty({ example: 'Clean Code' })
  @IsString()
  title!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  author?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  downloadUrl?: string;

  @ApiPropertyOptional({ enum: CefrLevel, example: CefrLevel.B1 })
  @IsEnum(CefrLevel)
  @IsOptional()
  level?: CefrLevel;
}
