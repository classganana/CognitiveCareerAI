import { addEvidenceSchema } from "@/features/knowledge/schemas/knowledge-edit.schema";
import { getErrorMessage, jsonData, jsonError } from "@/lib/api/response";
import { addEvidenceToKnowledgeClaim } from "@/services/knowledge.service";

type RouteContext = {
  params: Promise<{ knowledgeId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { knowledgeId } = await context.params;
    const body = await request.json();
    const parsed = addEvidenceSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid request body", 400);
    }

    const claim = await addEvidenceToKnowledgeClaim(
      knowledgeId,
      parsed.data.observationId,
    );

    if (!claim) {
      return jsonError("Knowledge claim or observation not found", 404);
    }

    return jsonData(claim);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}
