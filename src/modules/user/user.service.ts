import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from '../../types/user.types';

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
    return await this.userRepo.createUser({ name, email });
  }
}
