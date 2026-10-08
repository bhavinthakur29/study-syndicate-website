"use client";

import { useState } from "react";
import { Field, attempt, input } from "@/components/admin/ui";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Doc, Id } from "../../../../convex/_generated/dataModel";

type Status = "active" | "inactive" | "all";
type Form = {
  name: string;
  phone: string;
  email: string;
  exam: string;
  isMinor: boolean;
  guardianName: string;
  guardianPhone: string;
  notes: string;
};
const empty: Form = {
  name: "",
  phone: "",
  email: "",
  exam: "",
  isMinor: false,
  guardianName: "",
  guardianPhone: "",
  notes: "",
};

export default function MembersPage() {
  const [status, setStatus] = useState<Status>("active");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<Form | null>(null);
  const [editId, setEditId] = useState<Id<"members"> | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const members = useQuery(api.members.list, { status });
  const create = useMutation(api.members.create);
  const update = useMutation(api.members.update);
  const setMemberStatus = useMutation(api.members.setStatus);

  const q = search.trim().toLowerCase();
  const shown = members?.filter(
    (m) =>
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.phone.includes(q.replace(/\D/g, "") || "\u0000"),
  );

  const set = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((f) => (f ? { ...f, [k]: v } : f));

  function startEdit(m: Doc<"members">) {
    setEditId(m._id);
    setError("");
    setForm({
      name: m.name,
      phone: m.phone,
      email: m.email ?? "",
      exam: m.exam ?? "",
      isMinor: m.isMinor,
      guardianName: m.guardianName ?? "",
      guardianPhone: m.guardianPhone ?? "",
      notes: m.notes ?? "",
    });
  }

  async function save() {
    if (!form) return;
    setBusy(true);
    setError("");
    const payload = {
      name: form.name,
      phone: form.phone,
      email: form.email || undefined,
      exam: form.exam || undefined,
      isMinor: form.isMinor,
      guardianName: form.guardianName || undefined,
      guardianPhone: form.guardianPhone || undefined,
      notes: form.notes || undefined,
    };
    const r = editId
      ? await attempt(update({ id: editId, ...payload }), setError)
      : await attempt(create(payload), setError);
    setBusy(false);
    if (r) {
      setForm(null);
      setEditId(null);
    }
  }

  async function toggle(m: Doc<"members">) {
    setError("");
    await attempt(
      setMemberStatus({
        id: m._id,
        status: m.status === "active" ? "inactive" : "active",
      }),
      setError,
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-extrabold text-navy">
          Members
        </h1>
        <button
          onClick={() => {
            setEditId(null);
            setError("");
            setForm({ ...empty });
          }}
          className="rounded-xl bg-gold px-5 py-3 font-bold text-navy"
        >
          Add member
        </button>
      </div>

      {form && (
        <div className="mt-6 rounded-2xl border-2 border-gold bg-white p-5 md:p-6">
          <h2 className="font-display text-xl font-extrabold text-navy">
            {editId ? "Edit member" : "New member"}
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Name">
              <input
                className={input}
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                maxLength={80}
              />
            </Field>
            <Field label="Mobile number">
              <input
                className={input}
                inputMode="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                maxLength={16}
              />
            </Field>
            <Field label="Exam preparing for (optional)">
              <input
                className={input}
                value={form.exam}
                onChange={(e) => set("exam", e.target.value)}
                maxLength={80}
              />
            </Field>
            <Field label="Email (optional)">
              <input
                className={input}
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                maxLength={120}
              />
            </Field>
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm font-semibold text-navy">
            <input
              type="checkbox"
              checked={form.isMinor}
              onChange={(e) => set("isMinor", e.target.checked)}
              className="size-4"
            />
            Student is under 18
          </label>
          {form.isMinor && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Guardian name">
                <input
                  className={input}
                  value={form.guardianName}
                  onChange={(e) => set("guardianName", e.target.value)}
                  maxLength={80}
                />
              </Field>
              <Field label="Guardian mobile">
                <input
                  className={input}
                  inputMode="tel"
                  value={form.guardianPhone}
                  onChange={(e) => set("guardianPhone", e.target.value)}
                  maxLength={16}
                />
              </Field>
            </div>
          )}
          <div className="mt-4">
            <Field label="Notes (optional)">
              <textarea
                className={input}
                rows={2}
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                maxLength={500}
              />
            </Field>
          </div>
          {error && (
            <p role="alert" className="mt-4 font-semibold text-cabin">
              {error}
            </p>
          )}
          <div className="mt-5 flex gap-3">
            <button
              onClick={save}
              disabled={busy}
              className="rounded-xl bg-navy px-5 py-3 font-bold text-white disabled:opacity-60"
            >
              {busy ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => {
                setForm(null);
                setEditId(null);
                setError("");
              }}
              className="rounded-xl border-2 border-navy px-5 py-3 font-bold text-navy"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          className={`${input} max-w-xs`}
          placeholder="Search name or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={`${input} max-w-[10rem]`}
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="all">All</option>
        </select>
      </div>

      {!form && error && (
        <p role="alert" className="mt-4 font-semibold text-cabin">
          {error}
        </p>
      )}

      <ul className="mt-6 space-y-3">
        {shown === undefined && <li className="text-navy/70">Loading…</li>}
        {shown?.length === 0 && (
          <li className="text-navy/70">No members found.</li>
        )}
        {shown?.map((m) => (
          <li
            key={m._id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-navy/10 bg-white p-4"
          >
            <div>
              <p className="font-display text-lg font-extrabold text-navy">
                {m.name}
                {m.isMinor && (
                  <span className="ml-2 rounded-full bg-gold-soft px-2 py-0.5 text-xs font-bold">
                    Under 18
                  </span>
                )}
                {m.status === "inactive" && (
                  <span className="ml-2 rounded-full bg-navy/10 px-2 py-0.5 text-xs font-bold">
                    Inactive
                  </span>
                )}
              </p>
              <p className="text-sm text-navy/70">
                {m.phone}
                {m.exam ? ` · ${m.exam}` : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(m)}
                className="rounded-lg border border-navy/20 px-4 py-2 text-sm font-semibold text-navy"
              >
                Edit
              </button>
              <button
                onClick={() => toggle(m)}
                disabled={m.status === "active" && m.hasActiveMembership}
                title={
                  m.status === "active" && m.hasActiveMembership
                    ? "End their membership first"
                    : undefined
                }
                className="rounded-lg border border-navy/20 px-4 py-2 text-sm font-semibold text-navy disabled:opacity-40"
              >
                {m.status === "active" ? "Deactivate" : "Reactivate"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
