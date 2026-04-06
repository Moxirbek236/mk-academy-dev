import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsNumber, IsEnum } from 'class-validator';
import { TransactionType } from '../../../core/enums';

export class CreateTransactionDto {
  @ApiProperty()
  @IsInt()
  userId: number;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: TransactionType, default: TransactionType.EXPENSE })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty()
  @IsString()
  reason: string;
}
