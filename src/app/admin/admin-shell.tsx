"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  AuthLoading,
  Authenticated,
  Unauthenticated,
  useQuery,
} from "convex/react";
import { SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import { api } from "../../../convex/_generated/api";

function Authorized({ children }: { children: ReactNode }) {
  const me = useQuery(api.staff.me);

  if (me === undefined) return <p className="text-navy/70">Checking access…</p>;

  if (me === null) {
    return (
      <div className="max-w-md rounded-2xl border border-navy/10 bg-white p-6">
        <h1 className="font-display text-2xl font-extrabold text-navy">
          Not authorised
        </h1>
        <p className="mt-2 text-navy/70">
          This account doesn't have access to the admin area.
        </p>
        <SignOutButton>
          <button className="mt-4 rounded-xl bg-navy px-5 py-3 font-bold text-white">
            Sign out
          </button>
        </SignOutButton>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-6 flex items-center justify-between border-b border-navy/10 pb-4">
        <nav className="flex items-center gap-5 font-semibold text-navy">
          <span className="font-display text-xl font-extrabold">Admin</span>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/members">Members</Link>
          <Link href="/admin/memberships">Memberships</Link>
        </nav>
        <div className="flex items-center gap-3 text-sm text-navy/70">
          <span>{me.name}</span>
          <UserButton />
        </div>
      </header>
      {children}
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper p-5 md:p-8">
      <AuthLoading>
        <p className="text-navy/70">Loading…</p>
      </AuthLoading>
      <Unauthenticated>
        <div className="max-w-md rounded-2xl border border-navy/10 bg-white p-6">
          <h1 className="font-display text-2xl font-extrabold text-navy">
            Staff sign-in
          </h1>
          <p className="mt-2 text-navy/70">Sign in with your Google account.</p>
          <SignInButton mode="modal">
            <button className="mt-4 rounded-xl bg-gold px-5 py-3 font-bold text-navy">
              Sign in with Google
            </button>
          </SignInButton>
        </div>
      </Unauthenticated>
      <Authenticated>
        <Authorized>{children}</Authorized>
      </Authenticated>
    </div>
  );
}
