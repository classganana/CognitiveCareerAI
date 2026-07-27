import { capabilityFormSchema } from "@/features/capabilities/schemas/capability-form.schema";
import { getErrorMessage, jsonData, jsonError } from "@/lib/api/response";
import {
  createCapability,
  listCapabilitiesByCareerCase,
} from "@/services/capability.service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const capabilities = await listCapabilitiesByCareerCase(id);
    return jsonData(capabilities);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = capabilityFormSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid request body", 400);
    }

    const capability = await createCapability(id, parsed.data);

    if (!capability) {
      return jsonError("Career case not found", 404);
    }

    return jsonData(capability, 201);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}
