import { getErrorMessage, jsonData, jsonError } from "@/lib/api/response";
import { removeEvidenceFromKnowledgeClaim } from "@/services/knowledge.service";

type RouteContext = {
  params: Promise<{ knowledgeId: string; evidenceId: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { knowledgeId, evidenceId } = await context.params;
    const claim = await removeEvidenceFromKnowledgeClaim(knowledgeId, evidenceId);

    if (!claim) {
      return jsonError("Evidence not found", 404);
    }

    return jsonData(claim);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}
