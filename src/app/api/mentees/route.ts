import { createMenteeSchema } from "@/features/mentees/schemas/mentee-form.schema";
import { getErrorMessage, jsonData, jsonError } from "@/lib/api/response";
import { createMentee, listMentees } from "@/services/mentee.service";

export async function GET() {
  try {
    const mentees = await listMentees();
    return jsonData(mentees);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createMenteeSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid request body", 400);
    }

    const result = await createMentee(parsed.data);
    return jsonData(result, 201);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}
