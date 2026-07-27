import { getErrorMessage, jsonData, jsonError } from "@/lib/api/response";
import { listKnowledgeClaims } from "@/services/knowledge.service";

export async function GET() {
  try {
    const claims = await listKnowledgeClaims();
    return jsonData(claims);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}
