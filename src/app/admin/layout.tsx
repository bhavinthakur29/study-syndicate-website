import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { AdminConvexProvider } from "./convex-provider";
import { AdminShell } from "./admin-shell";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <p className="p-8">Admin is not configured yet.</p>;
  }
  return (
    <ClerkProvider>
      <AdminConvexProvider>
        <AdminShell>{children}</AdminShell>
      </AdminConvexProvider>
    </ClerkProvider>
  );
}
