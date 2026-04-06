import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, Min } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({ description: 'Question type, e.g. MCQ, ESSAY', example: 'MCQ' })
  @IsString()
  type!: string;

  @ApiProperty({ description: 'The question text' })
  @IsString()
  questionText!: string;

  @ApiPropertyOptional({ description: 'JSON string of answer options' })
  @IsString()
  @IsOptional()
  options?: string;

  @ApiPropertyOptional({ description: 'JSON string of the correct answer' })
  @IsString()
  @IsOptional()
  correctAnswer?: string;

  @ApiPropertyOptional({ description: 'Points for this question', default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  points?: number;
}
