import { Types } from "mongoose";

import type { Mentee } from "@/types/domain/mentee";
import type { CareerCase } from "@/types/domain/career-case";

export type SerializedMentee = Omit<Mentee, "_id" | "mentorId" | "createdAt" | "updatedAt"> & {
  _id: string;
  mentorId: string;
  createdAt: string;
  updatedAt: string;
};

export type SerializedCareerCase = Omit<
  CareerCase,
  "_id" | "menteeId" | "createdAt" | "updatedAt"
> & {
  _id: string;
  menteeId: string;
  createdAt: string;
  updatedAt: string;
};

export function serializeMentee(mentee: Mentee): SerializedMentee {
  return {
    _id: mentee._id.toString(),
    mentorId: mentee.mentorId.toString(),
    fullName: mentee.fullName,
    email: mentee.email,
    phone: mentee.phone,
    currentRole: mentee.currentRole,
    targetRole: mentee.targetRole,
    careerStage: mentee.careerStage,
    yearsOfExperience: mentee.yearsOfExperience,
    notes: mentee.notes,
    status: mentee.status,
    createdAt: mentee.createdAt.toISOString(),
    updatedAt: mentee.updatedAt.toISOString(),
  };
}

export function serializeCareerCase(careerCase: CareerCase): SerializedCareerCase {
  return {
    _id: careerCase._id.toString(),
    menteeId: careerCase.menteeId.toString(),
    title: careerCase.title,
    description: careerCase.description,
    stage: careerCase.stage,
    status: careerCase.status,
    createdAt: careerCase.createdAt.toISOString(),
    updatedAt: careerCase.updatedAt.toISOString(),
  };
}

export function isValidObjectId(id: string): boolean {
  return Types.ObjectId.isValid(id);
}
