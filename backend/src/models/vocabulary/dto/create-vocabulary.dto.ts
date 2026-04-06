import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsUrl, IsEnum } from 'class-validator';
import { CefrLevel } from '../../../core/enums';

export class CreateVocabularyDto {
  @ApiProperty({ example: 'Ambiguous' })
  @IsString()
  word!: string;

  @ApiProperty({ example: 'Having a double meaning; unclear.' })
  @IsString()
  definition!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  translation?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  exampleUsage?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  audioUrl?: string;

  @ApiPropertyOptional({ enum: CefrLevel, example: CefrLevel.C1 })
  @IsOptional()
  @IsEnum(CefrLevel)
  level?: CefrLevel;
}
