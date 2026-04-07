import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { UserRole } from 'src/core/enums';

export class QueryUserAdminDto {

    @ApiPropertyOptional({ enum: [UserRole.STUDENT, UserRole.TEACHER] })
    @IsOptional()
    @IsString()
    @IsEnum([UserRole.STUDENT, UserRole.TEACHER])
    user?: UserRole.STUDENT | UserRole.TEACHER;

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
