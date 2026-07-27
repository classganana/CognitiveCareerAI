import { getErrorMessage, jsonData, jsonError } from "@/lib/api/response";
import { listAvailableObservationsForKnowledgeClaim } from "@/services/knowledge.service";

type RouteContext = {
  params: Promise<{ knowledgeId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { knowledgeId } = await context.params;
    const observations = await listAvailableObservationsForKnowledgeClaim(knowledgeId);
    return jsonData(observations);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}
