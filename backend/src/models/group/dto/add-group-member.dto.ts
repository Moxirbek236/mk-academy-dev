import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class AddGroupMemberDto {
  @ApiProperty({ description: 'ID of the student to add' })
  @IsInt()
  studentId!: number;
}
