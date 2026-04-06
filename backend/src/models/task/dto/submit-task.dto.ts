import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SubmitTaskDto {
  @ApiProperty({ description: 'Submission content — file URL or plain text' })
  @IsString()
  submissionContent!: string;
}
