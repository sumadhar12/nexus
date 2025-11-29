import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsArray,
  IsInt,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Implement user authentication' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Implement JWT-based authentication system' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    enum: ['todo', 'in_progress', 'completed'],
    default: 'todo',
  })
  @IsOptional()
  @IsEnum(['todo', 'in_progress', 'completed'])
  stage?: string;

  @ApiPropertyOptional({
    enum: ['high', 'medium', 'normal', 'low'],
    default: 'normal',
  })
  @IsOptional()
  @IsEnum(['high', 'medium', 'normal', 'low'])
  priority?: string;

  @ApiPropertyOptional({ example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ example: ['frontend', 'backend'] })
  @IsOptional()
  team?: any;
}

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: 'Updated task title' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional({ example: 'Updated task description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ['todo', 'in_progress', 'completed'] })
  @IsOptional()
  @IsEnum(['todo', 'in_progress', 'completed'])
  stage?: string;

  @ApiPropertyOptional({ enum: ['high', 'medium', 'normal', 'low'] })
  @IsOptional()
  @IsEnum(['high', 'medium', 'normal', 'low'])
  priority?: string;

  @ApiPropertyOptional({ example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ example: ['frontend', 'backend'] })
  @IsOptional()
  team?: any;
}
