import { clerkMiddleware } from "@clerk/nextjs/server";
import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from "next/server";

const clerk = clerkMiddleware();

export default function proxy(req: NextRequest, event: NextFetchEvent) {
  // Without keys (for example a deploy that isn't configured yet) do nothing instead of erroring.
  if (!process.env.CLERK_SECRET_KEY) return NextResponse.next();
  return clerk(req, event);
}

export const config = { matcher: ["/admin(.*)"] };
