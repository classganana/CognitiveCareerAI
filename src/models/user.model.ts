import { Schema, model, models, type Model } from "mongoose";

import type { User } from "@/types/domain/user";
import { UserRole } from "@/types/domain/user";

import { defaultSchemaOptions } from "./shared";

const UserSchema = new Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.MENTOR,
      required: true,
    },
  },
  defaultSchemaOptions,
);

UserSchema.index({ email: 1 });

export const UserModel: Model<User> =
  models.User ?? model<User>("User", UserSchema);
