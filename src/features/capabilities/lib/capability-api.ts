import type {
  SerializedCapability,
  SerializedCapabilityDetail,
  SerializedCapabilitySummary,
} from "@/features/capabilities/lib/serialize-capability";
import type { CapabilityFormValues } from "@/features/capabilities/schemas/capability-form.schema";
import type { SerializedObservation } from "@/features/meetings/lib/serialize-meeting";

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed");
  }

  return payload.data as T;
}

export async function fetchCapabilities(
  careerCaseId: string,
): Promise<SerializedCapabilitySummary[]> {
  const response = await fetch(`/api/career-cases/${careerCaseId}/capabilities`);
  return parseResponse<SerializedCapabilitySummary[]>(response);
}

export async function fetchCareerCaseObservations(
  careerCaseId: string,
): Promise<SerializedObservation[]> {
  const response = await fetch(`/api/career-cases/${careerCaseId}/observations`);
  return parseResponse<SerializedObservation[]>(response);
}

export async function fetchCapabilityDetails(
  careerCaseId: string,
  capabilityId: string,
): Promise<SerializedCapabilityDetail> {
  const response = await fetch(
    `/api/career-cases/${careerCaseId}/capabilities/${capabilityId}`,
  );

  return parseResponse<SerializedCapabilityDetail>(response);
}

export async function createCapability(
  careerCaseId: string,
  values: CapabilityFormValues,
): Promise<SerializedCapability> {
  const response = await fetch(`/api/career-cases/${careerCaseId}/capabilities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  return parseResponse<SerializedCapability>(response);
}

export async function updateCapability(
  careerCaseId: string,
  capabilityId: string,
  values: CapabilityFormValues,
): Promise<SerializedCapability> {
  const response = await fetch(
    `/api/career-cases/${careerCaseId}/capabilities/${capabilityId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    },
  );

  return parseResponse<SerializedCapability>(response);
}

export async function deleteCapabilityApi(
  careerCaseId: string,
  capabilityId: string,
): Promise<void> {
  const response = await fetch(
    `/api/career-cases/${careerCaseId}/capabilities/${capabilityId}`,
    { method: "DELETE" },
  );

  await parseResponse<{ success: boolean }>(response);
}
