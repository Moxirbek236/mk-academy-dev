import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from 'src/core/enums';

export class QueryUserDto {
    
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @IsEnum([UserRole.STUDENT, UserRole.TEACHER])
    user:[UserRole.STUDENT, UserRole.TEACHER]

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    fullName?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    GroupName?: string;
}
