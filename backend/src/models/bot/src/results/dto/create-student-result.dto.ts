import { ExamType } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateStudentResultDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  studentFullName!: string;

  @IsEnum(ExamType)
  examType!: ExamType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  scoreOrLevel!: string;

  @IsString()
  @IsNotEmpty()
  certificateImage!: string;

  @IsDateString()
  examDate!: string;

  @IsUrl()
  channelPostLink!: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  note?: string;
}
