import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from '../../entities/task.entity';
import { User } from '../../entities/user.entity';
import { Comment } from '../../entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User, Comment]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
