import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Res,
  HttpStatus,
  Put,
  Delete,
  Request,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Response } from 'express';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('task')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createTask(
    @Body() body: CreateTaskDto,
    @Req() req,
    @Res() res: Response,
  ) {
    try {
      const userId = req.user.userId;
      const result = await this.tasksService.createTask(body, userId);
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

  @Put('update/:id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateData: UpdateTaskDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.tasksService.updateTask(
        parseInt(id),
        updateData,
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        return res.status(HttpStatus.NOT_FOUND).json({
          status: false,
          message: error.message,
        });
      }
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: false,
        message: error.message,
      });
    }
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.tasksService.deleteTask(parseInt(id));
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        return res.status(HttpStatus.NOT_FOUND).json({
          status: false,
          message: error.message,
        });
      }
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: false,
        message: error.message,
      });
    }
  }

  @Get(':id')
  async getTask(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.tasksService.getTask(parseInt(id));
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        return res.status(HttpStatus.NOT_FOUND).json({
          status: false,
          message: error.message,
        });
      }
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: false,
        message: error.message,
      });
    }
  }

  @Post('comment/:id')
  async addComment(
    @Param('id') id: string,
    @Body() body: { text: string; user: any },
    @Request() req,
    @Res() res: Response,
  ) {
    try {
      const result = await this.tasksService.addComment(
        parseInt(id),
        body.text,
        body.user.id,
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        return res.status(HttpStatus.NOT_FOUND).json({
          status: false,
          message: error.message,
        });
      }
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: false,
        message: error.message,
      });
    }
  }
}
