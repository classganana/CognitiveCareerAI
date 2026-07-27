import { Types } from "mongoose";

import { UserModel } from "@/models/user.model";
import { connectToDatabase } from "@/lib/db/mongoose";
import { UserRole } from "@/types/domain/user";

export type CurrentMentor = {
  id: string;
  displayName: string;
  initials: string;
  email: string;
};

async function findOrCreateDefaultMentor() {
  await connectToDatabase();

  const existingMentor = await UserModel.findOne({ role: UserRole.MENTOR });

  if (existingMentor) {
    return existingMentor;
  }

  return UserModel.create({
    email: "mentor@cognitivecareer.ai",
    firstName: "Default",
    lastName: "Mentor",
    role: UserRole.MENTOR,
  });
}

export async function getDefaultMentorId(): Promise<Types.ObjectId> {
  const mentor = await findOrCreateDefaultMentor();
  return mentor._id;
}

export async function getCurrentMentor(): Promise<CurrentMentor> {
  const mentor = await findOrCreateDefaultMentor();
  const displayName = `${mentor.firstName} ${mentor.lastName}`.trim() || "Mentor";
  const initials =
    `${mentor.firstName?.[0] ?? ""}${mentor.lastName?.[0] ?? ""}`.toUpperCase() ||
    "MN";

  return {
    id: mentor._id.toString(),
    displayName,
    initials,
    email: mentor.email,
  };
}

export async function getCurrentMentorDisplayName() {
  const mentor = await getCurrentMentor();
  return mentor.displayName;
}
