import { capabilityFormSchema } from "@/features/capabilities/schemas/capability-form.schema";
import { getErrorMessage, jsonData, jsonError } from "@/lib/api/response";
import {
  deleteCapability,
  getCapabilityDetails,
  updateCapability,
} from "@/services/capability.service";

type RouteContext = {
  params: Promise<{ id: string; capabilityId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id, capabilityId } = await context.params;
    const capability = await getCapabilityDetails(id, capabilityId);

    if (!capability) {
      return jsonError("Capability not found", 404);
    }

    return jsonData(capability);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id, capabilityId } = await context.params;
    const body = await request.json();
    const parsed = capabilityFormSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid request body", 400);
    }

    const capability = await updateCapability(id, capabilityId, parsed.data);

    if (!capability) {
      return jsonError("Capability not found", 404);
    }

    return jsonData(capability);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id, capabilityId } = await context.params;
    const deleted = await deleteCapability(id, capabilityId);

    if (!deleted) {
      return jsonError("Capability not found", 404);
    }

    return jsonData({ success: true });
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}
