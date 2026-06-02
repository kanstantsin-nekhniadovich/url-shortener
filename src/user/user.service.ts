import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from '../types/user.types';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async getUsers() {
    return await this.userRepo.findAll();
  }

  async createUser({
    name,
    email,
  }: {
    name: string;
    email: string;
  }): Promise<User> {
    try {
      return await this.userRepo.createUser({ name, email });
    } catch (err) {
      throw new HttpException(
        'User creating failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: err as Error,
        },
      );
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findByEmail(email);
  }
}
