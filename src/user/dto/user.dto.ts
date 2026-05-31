import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { User } from 'src/types/user.types';

export class UserDto implements User {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  name: string | null;

  @IsEmail()
  email: string | null;
}
