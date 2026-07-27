import { getErrorMessage, jsonData, jsonError } from "@/lib/api/response";
import { getObservationPromotionMap } from "@/services/knowledge.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const observationIds = Array.isArray(body.observationIds)
      ? body.observationIds.filter((id: unknown) => typeof id === "string")
      : [];

    const map = await getObservationPromotionMap(observationIds);
    return jsonData(map);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}
