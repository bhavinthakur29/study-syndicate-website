import { ConvexError } from "convex/values";

export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

// Turns our own business-rule errors into a result instead of a thrown error.
// Unexpected errors, including "Not authorized", still throw and get logged.
export async function safe<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (e) {
    if (e instanceof ConvexError && typeof e.data === "string")
      return { ok: false, error: e.data };
    throw e;
  }
}
