import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { TasksService } from './tasks.service';

@Controller('task')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('create')
  async createTask(@Body() body: any, @Res() res: Response) {
    try {
      const result = await this.tasksService.createTask(body);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: false,
        message: error.message,
      });
    }
  }

  @Get()
  async getTasks(@Query('stage') stage: string, @Res() res: Response) {
    try {
      const result = await this.tasksService.getTasks(stage);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: false,
        message: error.message,
      });
    }
  }

  @Get('user/:email')
  async getTasksByUser(
    @Param('email') email: string,
    @Query('stage') stage: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.tasksService.getTasksByUser(email, stage);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: false,
        message: error.message,
      });
    }
  }
}
