import type { DB } from '../../db/client';
import { CreateUser, User } from "../../types/user.types";
export declare class UserRepository {
    private readonly db;
    constructor(db: DB);
    createUser({ name, email }: CreateUser): Promise<User>;
    find(id: string): Promise<{
        id: string;
        name: string;
        email: string;
    } | null>;
    findAll(): Promise<{
        id: string;
        name: string;
        email: string;
    }[]>;
}
