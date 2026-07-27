import { getErrorMessage, jsonData, jsonError } from "@/lib/api/response";
import { deleteMeeting, getMeetingDetails } from "@/services/meeting.service";

type RouteContext = {
  params: Promise<{ id: string; meetingId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id, meetingId } = await context.params;
    const details = await getMeetingDetails(meetingId, id);

    if (!details) {
      return jsonError("Session not found", 404);
    }

    return jsonData(details);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id, meetingId } = await context.params;
    const deleted = await deleteMeeting(meetingId, id);

    if (!deleted) {
      return jsonError("Session not found", 404);
    }

    return jsonData({ success: true });
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}
