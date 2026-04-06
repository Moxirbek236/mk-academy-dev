import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class AssignCourseDto {
  @ApiProperty({ description: 'ID of the course to assign' })
  @IsInt()
  courseId!: number;
}
