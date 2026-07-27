import { getErrorMessage, jsonData, jsonError } from "@/lib/api/response";
import { listObservationsForCareerCase } from "@/services/capability.service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const observations = await listObservationsForCareerCase(id);
    return jsonData(observations);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}
