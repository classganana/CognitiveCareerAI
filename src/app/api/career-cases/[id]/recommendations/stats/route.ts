import { getErrorMessage, jsonData, jsonError } from "@/lib/api/response";
import { getRecommendationDashboardStats } from "@/services/recommendation.service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const stats = await getRecommendationDashboardStats(id);

    if (!stats) {
      return jsonError("Career case not found", 404);
    }

    return jsonData(stats);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}
