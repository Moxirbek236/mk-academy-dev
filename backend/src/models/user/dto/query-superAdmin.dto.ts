import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { UserRole } from '../../../core/enums';
import { Transform } from 'class-transformer';

export class QueryUserDto {

    @ApiPropertyOptional({ enum: [UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN] })
    @IsOptional()
    @IsString()
    @IsEnum([UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN])
    user?: UserRole.STUDENT | UserRole.TEACHER | UserRole.ADMIN;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    fullName?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    GroupName?: string;

    @ApiPropertyOptional({ enum: [1, 0] })
    @IsOptional()
    @Transform(({ value }) => {
        if (value === undefined || value === null) return undefined;
        return value === '1' || value === 1 || value === 'true' || value === true;
    })
    @IsBoolean()
    isActive?: boolean
}
