import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsBoolean, IsInt, IsOptional } from 'class-validator';

export class CreateGroupAssignmentDto {
  @ApiPropertyOptional({ description: 'ID of the test to assign' })
  @IsInt()
  @IsOptional()
  testId?: number;

  @ApiPropertyOptional({ description: 'ID of the task to assign' })
  @IsInt()
  @IsOptional()
  taskId?: number;

  @ApiPropertyOptional({ description: 'Due date for the assignment' })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiPropertyOptional({ description: 'Whether the assignment is required', default: true })
  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;
}
