import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from 'src/core/enums';

export class QueryUserDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    fullName?: string;
}
