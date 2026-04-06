import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional, Min, Max } from 'class-validator';

export class GradeTaskDto {
  @ApiProperty({ description: 'Score (0 to maxScore)', minimum: 0 })
  @IsInt()
  @Min(0)
  score!: number;

  @ApiPropertyOptional({ description: 'Optional feedback from the teacher' })
  @IsString()
  @IsOptional()
  teacherFeedback?: string;
}
