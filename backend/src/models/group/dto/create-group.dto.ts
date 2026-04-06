import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsDateString } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ description: 'Name of the group' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Description of the group' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'ID of the teacher/creator' })
  @IsInt()
  creatorId: number;

  @ApiPropertyOptional({ description: 'Status of the group', default: 'ACTIVE' })
  @IsString()
  @IsOptional()
  status?: string;
}
