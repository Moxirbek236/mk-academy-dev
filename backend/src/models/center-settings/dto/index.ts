import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCenterSettingsDto {
  @ApiPropertyOptional({ example: 'MK Academy' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional({ example: 'MK Academy' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  shortName?: string;

  @ApiPropertyOptional({
    example:
      'https://res.cloudinary.com/demo/image/upload/sample.jpg',
  })
  @IsOptional()
  @IsUrl({
    require_protocol: true,
  })
  logoUrl?: string;

  @ApiPropertyOptional({
    example:
      "Ingliz tilini CEFR standarti bo'yicha o'rgatishga ixtisoslashgan ta'lim markazi.",
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;
}
