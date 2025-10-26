import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { TaskAttachment } from './task-attachment.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @Column({ type: 'varchar', length: 50, default: 'normal' })
  priority: string;

  @Column({ type: 'varchar', length: 50, default: 'todo' })
  stage: string;

  @Column({ type: 'json', nullable: true })
  team: any; // Mixed type to match Express backend

  @Column({ name: 'created_by' })
  createdById: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.createdTasks)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[];

  @OneToMany(() => TaskAttachment, (attachment) => attachment.task)
  attachments: TaskAttachment[];
}