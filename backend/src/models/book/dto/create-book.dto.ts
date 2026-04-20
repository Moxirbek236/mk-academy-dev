import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: 'Essential Grammar in Use' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Raymond Murphy' })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({ example: 'Best grammar book for A1-A2 students' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/book-cover.jpg' })
  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @ApiProperty({ example: 'https://example.com/books/grammar.pdf' })
  @IsUrl()
  fileUrl: string;

  @ApiPropertyOptional({ example: 'A2' })
  @IsOptional()
  @IsString()
  cefrLevel?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}