import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class JoinGroupDto {
  @ApiProperty({ description: 'Invite code for the group' })
  @IsString()
  inviteCode!: string;
}
