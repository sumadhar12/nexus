import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comment } from '../../entities/comment.entity';
import { Task } from '../../entities/task.entity';
import { User } from '../../entities/user.entity';
import { PaginationDto, getSkip } from '../../common/dto/pagination.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    taskId: number,
    text: string,
    authorId: number,
  ): Promise<Comment> {
    // Verify task exists
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    // Create comment
    const comment = this.commentRepository.create({
      text,
      taskId,
      authorId,
    });

    return this.commentRepository.save(comment);
  }

  async findAll(
    taskId: number,
    paginationDto: PaginationDto,
  ): Promise<{ comments: Comment[]; total: number }> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = getSkip(page, limit);

    // Verify task exists
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    const [comments, total] = await this.commentRepository.findAndCount({
      where: { taskId },
      relations: ['author'],
      skip,
      take: limit,
      order: { createdAt: 'ASC' },
    });

    return { comments, total };
  }
}
