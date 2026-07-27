import type { Types } from "mongoose";

import type { BaseEntity } from "./base";

export enum UserRole {
  MENTOR = "mentor",
}

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole.MENTOR;
}

export type CreateUserInput = Pick<User, "email" | "firstName" | "lastName">;

export type UpdateUserInput = Partial<CreateUserInput>;

export type UserReference = Types.ObjectId | User;
