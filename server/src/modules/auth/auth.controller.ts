import { Controller, Post, Body, Res, HttpStatus, BadRequestException } from '@nestjs/common';
import type { Response } from 'express';

import { AuthService } from './auth.service';

@Controller('user')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { name: string; email: string; password: string },
    @Res() res: Response,
  ) { 
    try {
      const { name, email, password } = body;
      
      if (!name || !email || !password) {
        throw new BadRequestException('Name, email, and password are required');
      }

      const user = await this.authService.register(name, email, password, res);
      
      return res.status(HttpStatus.CREATED).json(user);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: false,
        message: error.message,
      });
    }
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    try {
      const { email, password } = body;
      
      if (!email || !password) {
        throw new BadRequestException('Email and password are required');
      }

      const user = await this.authService.login(email, password, res);
      
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        status: false,
        message: error.message,
      });
    }
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    try {
      const result = await this.authService.logout(res);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: false,
        message: error.message,
      });
    }
  }
}