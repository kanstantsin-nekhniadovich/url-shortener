import { CreateUser } from '../../../types/user.types';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto implements CreateUser {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
}
