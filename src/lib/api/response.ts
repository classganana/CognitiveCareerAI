import { NextResponse } from "next/server";

export function jsonData<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
