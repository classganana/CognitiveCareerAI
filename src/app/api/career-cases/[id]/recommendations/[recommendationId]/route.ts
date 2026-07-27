import { recommendationFormSchema } from "@/features/recommendations/schemas/recommendation-form.schema";
import { getErrorMessage, jsonData, jsonError } from "@/lib/api/response";
import {
  deleteRecommendation,
  getRecommendationDetails,
  updateRecommendation,
} from "@/services/recommendation.service";

type RouteContext = {
  params: Promise<{ id: string; recommendationId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id, recommendationId } = await context.params;
    const recommendation = await getRecommendationDetails(id, recommendationId);

    if (!recommendation) {
      return jsonError("Recommendation not found", 404);
    }

    return jsonData(recommendation);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id, recommendationId } = await context.params;
    const body = await request.json();
    const parsed = recommendationFormSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid request body", 400);
    }

    const recommendation = await updateRecommendation(id, recommendationId, parsed.data);

    if (!recommendation) {
      return jsonError("Recommendation not found or invalid links", 404);
    }

    return jsonData(recommendation);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id, recommendationId } = await context.params;
    const deleted = await deleteRecommendation(id, recommendationId);

    if (!deleted) {
      return jsonError("Recommendation not found", 404);
    }

    return jsonData({ success: true });
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}
