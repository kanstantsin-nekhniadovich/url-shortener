import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../../types/user.types';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUsers(): Promise<User[]>;
    createUser(user: CreateUserDto): Promise<User>;
}
