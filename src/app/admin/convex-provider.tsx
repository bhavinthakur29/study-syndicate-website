"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useState, type ReactNode } from "react";

export function AdminConvexProvider({ children }: { children: ReactNode }) {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  const [client] = useState(() => (url ? new ConvexReactClient(url) : null));

  if (!client) return <p className="p-8">Admin is not configured yet.</p>;
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
