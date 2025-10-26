import { Controller, Get, Res, HttpStatus, UseGuards, Request } from '@nestjs/common';
import type { Response } from 'express';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('get-users')
  @UseGuards(JwtAuthGuard)
  async getUsers(@Request() req, @Res() res: Response) {
    try {
      const result = await this.usersService.getUsers(req.user.userId);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error',
      });
    }
  }

  @Get('get-all-users')
  async getAllUsers(@Res() res: Response) {
    try {
      const users = await this.usersService.getAllUsers();
      return res.status(HttpStatus.OK).json(users);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: false,
        message: error.message,
      });
    }
  }
}