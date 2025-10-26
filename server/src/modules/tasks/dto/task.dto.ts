import { IsString, IsOptional, IsEnum, IsDateString, IsArray, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Implement user authentication' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Implement JWT-based authentication system' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ['todo', 'in progress', 'completed'], default: 'todo' })
  @IsOptional()
  @IsEnum(['todo', 'in progress', 'completed'])
  status?: string;

  @ApiPropertyOptional({ enum: ['high', 'medium', 'normal', 'low'], default: 'normal' })
  @IsOptional()
  @IsEnum(['high', 'medium', 'normal', 'low'])
  priority?: string;

  @ApiPropertyOptional({ example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  projectId?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  assignedToId?: number;

  @ApiPropertyOptional({ example: [1, 2, 3] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  assigneeIds?: number[];
}

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: 'Updated task title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Updated task description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ['todo', 'in progress', 'completed'] })
  @IsOptional()
  @IsEnum(['todo', 'in progress', 'completed'])
  status?: string;

  @ApiPropertyOptional({ enum: ['high', 'medium', 'normal', 'low'] })
  @IsOptional()
  @IsEnum(['high', 'medium', 'normal', 'low'])
  priority?: string;

  @ApiPropertyOptional({ example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  projectId?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  assignedToId?: number;

  @ApiPropertyOptional({ example: [1, 2, 3] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  assigneeIds?: number[];
}

export class AssignTaskDto {
  @ApiProperty({ example: [1, 2, 3] })
  @IsArray()
  @IsInt({ each: true })
  assigneeIds: number[];
}