import { User } from "../../../types/user.types";
export declare class UserDto implements User {
    id: string;
    name: string | null;
    email: string | null;
}
