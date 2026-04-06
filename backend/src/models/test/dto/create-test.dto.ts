import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateTestDto {
  @ApiProperty({ example: 'Final Exam: B2 Level' })
  @IsString()
  title!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 60, description: 'Duration in minutes' })
  @IsInt()
  duration!: number;

  @ApiProperty({ example: 70, description: 'Passing score percentage' })
  @IsInt()
  passingScore!: number;

  @ApiPropertyOptional({ description: 'ID of the course this test belongs to' })
  @IsInt()
  @IsOptional()
  courseId?: number;
}
