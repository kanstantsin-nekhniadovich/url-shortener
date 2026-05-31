import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../types/user.types';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  createUser(@Body() user: CreateUserDto): Promise<User> {
    return this.userService.createUser(user);
  }
}
