import type {
  RecommendationDashboardStats,
  SerializedRecommendation,
  SerializedRecommendationDetail,
  SerializedRecommendationSummary,
} from "@/features/recommendations/lib/serialize-recommendation";
import type { RecommendationFormValues } from "@/features/recommendations/schemas/recommendation-form.schema";

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed");
  }

  return payload.data as T;
}

export async function fetchRecommendations(
  careerCaseId: string,
): Promise<SerializedRecommendationSummary[]> {
  const response = await fetch(`/api/career-cases/${careerCaseId}/recommendations`);
  return parseResponse<SerializedRecommendationSummary[]>(response);
}

export async function fetchRecommendationDashboardStats(
  careerCaseId: string,
): Promise<RecommendationDashboardStats> {
  const response = await fetch(
    `/api/career-cases/${careerCaseId}/recommendations/stats`,
  );
  return parseResponse<RecommendationDashboardStats>(response);
}

export async function fetchRecommendationDetails(
  careerCaseId: string,
  recommendationId: string,
): Promise<SerializedRecommendationDetail> {
  const response = await fetch(
    `/api/career-cases/${careerCaseId}/recommendations/${recommendationId}`,
  );

  return parseResponse<SerializedRecommendationDetail>(response);
}

export async function createRecommendation(
  careerCaseId: string,
  values: RecommendationFormValues,
): Promise<SerializedRecommendation> {
  const response = await fetch(`/api/career-cases/${careerCaseId}/recommendations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  return parseResponse<SerializedRecommendation>(response);
}

export async function updateRecommendation(
  careerCaseId: string,
  recommendationId: string,
  values: RecommendationFormValues,
): Promise<SerializedRecommendation> {
  const response = await fetch(
    `/api/career-cases/${careerCaseId}/recommendations/${recommendationId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    },
  );

  return parseResponse<SerializedRecommendation>(response);
}

export async function deleteRecommendationApi(
  careerCaseId: string,
  recommendationId: string,
): Promise<void> {
  const response = await fetch(
    `/api/career-cases/${careerCaseId}/recommendations/${recommendationId}`,
    { method: "DELETE" },
  );

  await parseResponse<{ success: boolean }>(response);
}
