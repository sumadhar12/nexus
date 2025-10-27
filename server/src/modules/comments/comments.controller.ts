import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/comment.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Comments')
@Controller('tasks/:taskId/comments')
@ApiBearerAuth()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async create(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    return this.commentsService.create(
      taskId,
      createCommentDto.text,
      req.user.sub,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments for a task' })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.commentsService.findAll(taskId, paginationDto);
  }
}

@ApiTags('Comments')
@Controller('task/comment')
@ApiBearerAuth()
export class TaskCommentController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':taskId')
  @ApiOperation({ summary: 'Create a new comment on a task' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async create(
    @Param('taskId') taskId: string,
    @Body() createCommentDto: any,
    @Request() req,
  ) {
    const taskIdNumber = parseInt(taskId, 10);
    if (isNaN(taskIdNumber)) {
      throw new Error('Invalid task ID');
    }
    return this.commentsService.create(
      taskIdNumber,
      createCommentDto,
      req.user.sub,
    );
  }
}
