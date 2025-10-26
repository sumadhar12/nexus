import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.userRepository.find({
        select: ['id', 'name', 'email'],
      });
      return users;
    } catch (error) {
      throw new BadRequestException('Error');
    }
  }

  async getUsers(currentUserId: number): Promise<{ success: boolean; users: User[] }> {
    try {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .select(['user.id', 'user.name', 'user.email'])
        .where('user.id != :currentUserId', { currentUserId })
        .getMany();
      return { success: false, users };
    } catch (error) {
      throw new BadRequestException('Error');
    }
  }
}