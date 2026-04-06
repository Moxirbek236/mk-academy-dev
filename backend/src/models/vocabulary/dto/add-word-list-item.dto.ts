import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class AddWordListItemDto {
  @ApiProperty({ description: 'ID of the vocabulary word to add to the list' })
  @IsInt()
  vocabularyId!: number;
}
