import { getErrorMessage, jsonData, jsonError } from "@/lib/api/response";
import { archiveKnowledgeClaim } from "@/services/knowledge.service";

type RouteContext = {
  params: Promise<{ knowledgeId: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { knowledgeId } = await context.params;
    const claim = await archiveKnowledgeClaim(knowledgeId);

    if (!claim) {
      return jsonError("Knowledge claim not found or already archived", 404);
    }

    return jsonData(claim);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}
