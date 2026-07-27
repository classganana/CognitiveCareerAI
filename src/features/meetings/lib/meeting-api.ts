import type {
  SerializedMeeting,
  SerializedMeetingWithObservationCount,
  SerializedObservation,
} from "@/features/meetings/lib/serialize-meeting";
import type { CreateMeetingFormValues } from "@/features/meetings/schemas/meeting-form.schema";
import type { ObservationFormValues } from "@/features/meetings/schemas/observation-form.schema";

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed");
  }

  return payload.data as T;
}

export async function fetchMeetings(
  careerCaseId: string,
): Promise<SerializedMeetingWithObservationCount[]> {
  const response = await fetch(`/api/career-cases/${careerCaseId}/meetings`);
  return parseResponse<SerializedMeetingWithObservationCount[]>(response);
}

export async function createMeeting(
  careerCaseId: string,
  values: CreateMeetingFormValues,
): Promise<SerializedMeeting> {
  const response = await fetch(`/api/career-cases/${careerCaseId}/meetings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  return parseResponse<SerializedMeeting>(response);
}

export async function fetchMeetingDetails(
  careerCaseId: string,
  meetingId: string,
): Promise<{
  meeting: SerializedMeeting;
  observations: SerializedObservation[];
}> {
  const response = await fetch(
    `/api/career-cases/${careerCaseId}/meetings/${meetingId}`,
  );

  return parseResponse(response);
}

export async function deleteMeeting(
  careerCaseId: string,
  meetingId: string,
): Promise<void> {
  const response = await fetch(
    `/api/career-cases/${careerCaseId}/meetings/${meetingId}`,
    { method: "DELETE" },
  );

  await parseResponse<{ success: boolean }>(response);
}

export async function createObservation(
  meetingId: string,
  values: ObservationFormValues,
): Promise<SerializedObservation> {
  const response = await fetch(`/api/meetings/${meetingId}/observations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  return parseResponse<SerializedObservation>(response);
}

export async function updateObservation(
  observationId: string,
  values: ObservationFormValues,
): Promise<SerializedObservation> {
  const response = await fetch(`/api/observations/${observationId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  return parseResponse<SerializedObservation>(response);
}

export async function deleteObservationApi(observationId: string): Promise<void> {
  const response = await fetch(`/api/observations/${observationId}`, {
    method: "DELETE",
  });

  await parseResponse<{ success: boolean }>(response);
}
