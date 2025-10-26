import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from '../../entities/task.entity';
import { User } from '../../entities/user.entity';
import { Comment } from '../../entities/comment.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async createTask(body: any): Promise<{ status: boolean; task: Task; message: string }> {
    try {
      const { title, team, stage, date, priority, user } = body;
      
      if (!user || (!user._id && !user.id)) {
        throw new BadRequestException('User information is required');
      }
      
      // Use either _id (MongoDB style) or id (MySQL style)
      const userId = user._id || user.id;
      
      const task = this.taskRepository.create({
        title,
        team,
        stage: stage?.toLowerCase() || 'todo',
        date: date || new Date(),
        priority: priority?.toLowerCase() || 'normal',
        createdById: userId,
      });

      const savedTask = await this.taskRepository.save(task);
      
      // Fetch the complete task with relations
      const completeTask = await this.taskRepository.findOne({
        where: { id: savedTask.id },
        relations: ['createdBy', 'comments', 'comments.author'],
      });
      
      if (!completeTask) {
        throw new BadRequestException('Task was not created properly');
      }
      
      return {
        status: true,
        task: completeTask,
        message: 'Task created successfully.',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getTasks(stage?: string): Promise<{ status: boolean; tasks: Task[] }> {
    try {
      let query = this.taskRepository
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.createdBy', 'createdBy')
        .orderBy('task.id', 'DESC');

      if (stage) {
        query = query.where('task.stage = :stage', { stage });
      }

      const tasks = await query.getMany();

      return {
        status: true,
        tasks,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getTasksByUser(email: string, stage?: string): Promise<{ status: boolean; tasks: Task[] }> {
    try {
      let query = this.taskRepository
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.createdBy', 'createdBy')
        .where('JSON_SEARCH(task.team, \'one\', :email) IS NOT NULL', { email })
        .orderBy('task.id', 'DESC');

      if (stage) {
        query = query.andWhere('task.stage = :stage', { stage });
      }

      const tasks = await query.getMany();

      return {
        status: true,
        tasks,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}