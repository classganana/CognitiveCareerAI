import { createMeetingSchema } from "@/features/meetings/schemas/meeting-form.schema";
import { getErrorMessage, jsonData, jsonError } from "@/lib/api/response";
import {
  createMeeting,
  listMeetingsByCareerCase,
} from "@/services/meeting.service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const meetings = await listMeetingsByCareerCase(id);
    return jsonData(meetings);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = createMeetingSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid request body", 400);
    }

    const meeting = await createMeeting(id, {
      sessionDate: new Date(parsed.data.sessionDate),
      sessionType: parsed.data.sessionType,
      durationMinutes: parsed.data.durationMinutes,
      summary: parsed.data.summary,
    });

    if (!meeting) {
      return jsonError("Career case not found", 404);
    }

    return jsonData(meeting, 201);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}
