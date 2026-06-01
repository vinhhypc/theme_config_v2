import { NextResponse } from "next/server";

/** Standard error envelope: `{ error: { code, message } }`. */
export interface ApiError {
  error: { code: string; message: string };
}

export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

/** Thrown when a required API key is missing (degrade gracefully, 503). */
export function missingKey(service: string): HttpError {
  return new HttpError(
    503,
    "missing_key",
    `${service} is not configured. Add the key to .env or provide it in the UI, then try again.`,
  );
}

export function errorResponse(err: unknown): NextResponse<ApiError> {
  if (err instanceof HttpError) {
    return NextResponse.json({ error: { code: err.code, message: err.message } }, { status: err.status });
  }
  const message = err instanceof Error ? err.message : "Unexpected error";
  return NextResponse.json({ error: { code: "internal", message } }, { status: 500 });
}
