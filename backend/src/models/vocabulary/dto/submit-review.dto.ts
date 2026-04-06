import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max } from 'class-validator';

export class SubmitReviewDto {
  @ApiProperty({ description: 'SM-2 quality rating (0-5)', minimum: 0, maximum: 5 })
  @IsInt()
  @Min(0)
  @Max(5)
  quality!: number;
}
