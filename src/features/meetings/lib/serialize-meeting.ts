import type { Meeting } from "@/types/domain/meeting";
import type { Observation } from "@/types/domain/observation";

export type SerializedMeeting = Omit<
  Meeting,
  "_id" | "careerCaseId" | "sessionDate" | "createdAt" | "updatedAt"
> & {
  _id: string;
  careerCaseId: string;
  sessionDate: string;
  createdAt: string;
  updatedAt: string;
};

export type SerializedObservation = Omit<
  Observation,
  "_id" | "meetingId" | "createdAt" | "updatedAt"
> & {
  _id: string;
  meetingId: string;
  createdAt: string;
  updatedAt: string;
};

export type SerializedMeetingWithObservationCount = SerializedMeeting & {
  observationsCount: number;
};

export function serializeMeeting(meeting: Meeting): SerializedMeeting {
  return {
    _id: meeting._id.toString(),
    careerCaseId: meeting.careerCaseId.toString(),
    sessionDate: meeting.sessionDate.toISOString(),
    sessionType: meeting.sessionType,
    durationMinutes: meeting.durationMinutes,
    summary: meeting.summary,
    createdAt: meeting.createdAt.toISOString(),
    updatedAt: meeting.updatedAt.toISOString(),
  };
}

export function serializeObservation(observation: Observation): SerializedObservation {
  return {
    _id: observation._id.toString(),
    meetingId: observation.meetingId.toString(),
    title: observation.title,
    description: observation.description,
    category: observation.category,
    severity: observation.severity,
    createdAt: observation.createdAt.toISOString(),
    updatedAt: observation.updatedAt.toISOString(),
  };
}
