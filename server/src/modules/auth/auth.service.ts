import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Response } from 'express';

import { User } from '../../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(name: string, email: string, password: string, res: Response): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create user (password will be hashed by @BeforeInsert hook)
    const user = this.userRepository.create({
      name,
      email,
      password,
    });

    const savedUser = await this.userRepository.save(user);

    // Create JWT token
    const token = this.jwtService.sign({ userId: savedUser.id });

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword as User;
  }

  async login(email: string, password: string, res: Response): Promise<User> {
    // Find user by email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }
    // Verify password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Create JWT token
    const token = this.jwtService.sign({ userId: user.id });

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async logout(res: Response): Promise<{ message: string }> {
    res.clearCookie('token');
    return { message: 'Logout successful' };
  }

  async validateUser(userId: number): Promise<User | null> {
    console.log('Validating user with ID:', userId);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    console.log('User found:', user ? user.email : 'null');
    return user;
  }

  async validateUserByCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return null;
    }
    
    return user;
  }
}