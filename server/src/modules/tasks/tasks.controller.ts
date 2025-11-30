import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('task')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createTask(@Body() body: CreateTaskDto, @Req() req) {
    const userId = req.user.userId;
    return await this.tasksService.createTask(body, userId);
  }

  @Get()
  async getTasks(@Query('stage') stage: string) {
    return await this.tasksService.getTasks(stage);
  }

  @Get('user/:email')
  async getTasksByUser(
    @Param('email') email: string,
    @Query('stage') stage: string,
  ) {
    return await this.tasksService.getTasksByUser(email, stage);
  }

  @Put('update/:id')
  async updateTask(@Param('id') id: string, @Body() updateData: UpdateTaskDto) {
    return await this.tasksService.updateTask(parseInt(id), updateData);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    return await this.tasksService.deleteTask(parseInt(id));
  }

  @Get(':id')
  async getTask(@Param('id') id: string) {
    return await this.tasksService.getTask(parseInt(id));
  }

  @Post('comment/:id')
  async addComment(
    @Param('id') id: string,
    @Body() body: { text: string; user: any },
    @Req() req,
  ) {
    return await this.tasksService.addComment(
      parseInt(id),
      body.text,
      body.user.id,
    );
  }
}
