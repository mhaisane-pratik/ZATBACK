import { User } from "../users/user.entity";
export declare class AuthService {
    private userRepo;
    loginOrRegister(username: string): Promise<User>;
}
