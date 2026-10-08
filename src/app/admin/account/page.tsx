"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../../convex/_generated/api";
import {
  Alert,
  Button,
  Card,
  Field,
  PageHeader,
  attempt,
  input,
} from "@/components/admin/ui";

const roleText: Record<string, string> = {
  admin:
    "Admin. You can see and change everything, including the activity history and backups.",
  staff: "Staff. You can handle day-to-day work like admissions and fees.",
};

export default function AccountPage() {
  const me = useQuery(api.staff.me);
  const { user } = useUser();
  const updateName = useMutation(api.staff.updateName);

  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  if (me === undefined) return <p className="text-navy/70">Loading…</p>;
  if (me === null) return null;

  const name = draft ?? me.name;

  async function save() {
    setBusy(true);
    setError("");
    setNotice("");
    const r = await attempt(updateName({ name }), setError);
    setBusy(false);
    if (r) {
      setDraft(null);
      setNotice("Your name has been updated.");
    }
  }

  return (
    <div>
      <PageHeader
        title="My account"
        intro="Your details in this app. This is the name other people see in the activity history."
      />

      <Card className="mt-6 max-w-xl space-y-5 md:p-6">
        <div className="flex items-center gap-4">
          {user?.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.imageUrl} alt="" className="size-16 rounded-full" />
          )}
          <div>
            <p className="font-display text-xl font-extrabold text-navy">
              {me.name}
            </p>
            <p className="text-navy/70">{me.email}</p>
          </div>
        </div>

        <Field
          label="Your name"
          hint="This is how your name appears in this app. It does not change your Google account."
        >
          <input
            className={input}
            value={name}
            maxLength={60}
            placeholder="e.g. Anita Sharma"
            onChange={(e) => setDraft(e.target.value)}
          />
        </Field>

        <Field
          label="Email"
          hint="Comes from the Google account you sign in with, so it can't be changed here."
        >
          <input className={`${input} bg-navy/5`} value={me.email} disabled />
        </Field>

        <Field label="Your role">
          <p className="text-navy/80">{roleText[me.role] ?? me.role}</p>
        </Field>

        {error && <Alert>{error}</Alert>}
        {notice && (
          <p role="status" className="font-semibold text-navy">
            {notice}
          </p>
        )}

        <Button
          disabled={busy || draft === null || draft === me.name}
          onClick={save}
        >
          {busy ? "Saving…" : "Save name"}
        </Button>
      </Card>

      <Card className="mt-4 max-w-xl text-navy/80">
        <p className="font-display text-lg font-extrabold text-navy">
          Password and security
        </p>
        <p className="mt-1">
          You sign in with Google, so your password and 2-step verification are
          managed in your Google account. Keep 2-step verification on.
        </p>
        <a
          href="https://myaccount.google.com/security"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block font-semibold text-navy underline"
        >
          Open Google account security
        </a>
      </Card>
    </div>
  );
}
