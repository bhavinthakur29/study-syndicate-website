import type { Metadata } from "next";
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
  return (
    <div className="min-h-screen pt-24">
      <AdminConvexProvider>{children}</AdminConvexProvider>
    </div>
  );
}
