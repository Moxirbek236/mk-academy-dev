import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateWordListDto {
  @ApiProperty({ description: 'Name of the word list' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Whether the list is publicly visible', default: false })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
