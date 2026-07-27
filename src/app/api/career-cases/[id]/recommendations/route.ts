import { recommendationFormSchema } from "@/features/recommendations/schemas/recommendation-form.schema";
import { getErrorMessage, jsonData, jsonError } from "@/lib/api/response";
import {
  createRecommendation,
  listRecommendationsByCareerCase,
} from "@/services/recommendation.service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const recommendations = await listRecommendationsByCareerCase(id);
    return jsonData(recommendations);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = recommendationFormSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid request body", 400);
    }

    const recommendation = await createRecommendation(id, parsed.data);

    if (!recommendation) {
      return jsonError("Career case not found or invalid links", 404);
    }

    return jsonData(recommendation, 201);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}
