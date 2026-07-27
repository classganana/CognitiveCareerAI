import type { SerializedCareerCase, SerializedMentee } from "@/features/mentees/lib/serialize-mentee";
import type { CreateMenteeFormValues, UpdateMenteeFormValues } from "@/features/mentees/schemas/mentee-form.schema";

export type MenteeDetailResponse = {
  mentee: SerializedMentee;
  careerCase: SerializedCareerCase | null;
  summary: {
    capabilitiesCount: number;
    goalsCount: number;
    meetingsCount: number;
    recommendationsCount: number;
  };
};

export type CreateMenteeResponse = {
  mentee: SerializedMentee;
  careerCase: SerializedCareerCase;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed");
  }

  return payload.data as T;
}

export async function fetchMentees(): Promise<SerializedMentee[]> {
  const response = await fetch("/api/mentees");
  return parseResponse<SerializedMentee[]>(response);
}

export async function fetchMentee(id: string): Promise<MenteeDetailResponse> {
  const response = await fetch(`/api/mentees/${id}`);
  return parseResponse<MenteeDetailResponse>(response);
}

export async function createMentee(
  values: CreateMenteeFormValues,
): Promise<CreateMenteeResponse> {
  const response = await fetch("/api/mentees", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  return parseResponse<CreateMenteeResponse>(response);
}

export async function updateMentee(
  id: string,
  values: UpdateMenteeFormValues,
): Promise<SerializedMentee> {
  const response = await fetch(`/api/mentees/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  return parseResponse<SerializedMentee>(response);
}

export async function deleteMentee(id: string): Promise<void> {
  const response = await fetch(`/api/mentees/${id}`, {
    method: "DELETE",
  });

  await parseResponse<{ success: boolean }>(response);
}
