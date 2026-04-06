import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class SubmitAttemptDto {
  @ApiProperty({ description: 'Answer map: { [questionId]: answer }' })
  @IsObject()
  answers!: Record<string, unknown>;
}
