import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { AdminConvexProvider } from "./convex-provider";

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
        <div className="min-h-screen bg-paper p-5 md:p-8">{children}</div>
      </AdminConvexProvider>
    </ClerkProvider>
  );
}
