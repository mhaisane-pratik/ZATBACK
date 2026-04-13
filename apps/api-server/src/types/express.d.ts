import { User } from "../modules/users/user.entity";

declare global {
  namespace Express {
    interface Request {
      user?: Partial<User> & { id: string; company_id?: string };
    }
  }
}

export {};
