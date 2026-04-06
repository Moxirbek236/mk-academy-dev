import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsEnum } from 'class-validator';
import { TaskType } from '../../../core/enums';

export class CreateTaskDto {
  @ApiProperty({ example: 'Letter Writing: Formal Request' })
  @IsString()
  title!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: TaskType, default: TaskType.GRAMMAR })
  @IsEnum(TaskType)
  type!: TaskType;

  @ApiProperty({ description: 'XP points awarded on completion' })
  @IsInt()
  xpReward!: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  courseId?: number;
}
