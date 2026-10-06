"use client";

import {
  AuthLoading,
  Authenticated,
  Unauthenticated,
  useQuery,
} from "convex/react";
import { SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import { api } from "../../../convex/_generated/api";

function Gate() {
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
    <div className="flex items-center justify-between">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-navy">
          Admin
        </h1>
        <p className="mt-1 text-navy/70">
          Signed in as {me.name} ({me.role}). The dashboard arrives in the next
          steps.
        </p>
      </div>
      <UserButton />
    </div>
  );
}

export default function AdminHome() {
  return (
    <>
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
        <Gate />
      </Authenticated>
    </>
  );
}
