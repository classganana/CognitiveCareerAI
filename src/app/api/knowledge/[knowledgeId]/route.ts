import { knowledgeEditSchema } from "@/features/knowledge/schemas/knowledge-edit.schema";
import { getErrorMessage, jsonData, jsonError } from "@/lib/api/response";
import {
  getKnowledgeClaimDetails,
  updateKnowledgeClaim,
} from "@/services/knowledge.service";

type RouteContext = {
  params: Promise<{ knowledgeId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { knowledgeId } = await context.params;
    const claim = await getKnowledgeClaimDetails(knowledgeId);

    if (!claim) {
      return jsonError("Knowledge claim not found", 404);
    }

    return jsonData(claim);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { knowledgeId } = await context.params;
    const body = await request.json();
    const parsed = knowledgeEditSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid request body", 400);
    }

    const claim = await updateKnowledgeClaim(knowledgeId, parsed.data);

    if (!claim) {
      return jsonError("Knowledge claim not found", 404);
    }

    return jsonData(claim);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}
