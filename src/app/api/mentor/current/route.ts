import { getErrorMessage, jsonData, jsonError } from "@/lib/api/response";
import { getCurrentMentor } from "@/lib/mentor/default-mentor";

export async function GET() {
  try {
    const mentor = await getCurrentMentor();
    return jsonData(mentor);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}
