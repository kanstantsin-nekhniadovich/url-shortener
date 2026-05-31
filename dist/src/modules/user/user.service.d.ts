import { UserRepository } from './user.repository';
import { User } from '../../types/user.types';
export declare class UserService {
    private readonly userRepo;
    constructor(userRepo: UserRepository);
    getUsers(): Promise<{
        id: string;
        name: string;
        email: string;
    }[]>;
    createUser({ name, email, }: {
        name: string;
        email: string;
    }): Promise<User>;
}
