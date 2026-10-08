"use client";

import { useState } from "react";
import { Field, PageHeader, attempt, input } from "@/components/admin/ui";
import type { Result } from "../../../../convex/lib/result";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { PLANS, type PlanKey } from "../../../../convex/lib/plans";
import {
  DAY,
  addMonthsIST,
  endOfDayIST,
  formatDate,
  startOfDayIST,
  toDateInput,
} from "../../../../convex/lib/dates";

type Form = {
  memberId: string;
  cabin: string;
  plan: PlanKey;
  amount: string;
  start: string;
  end: string;
};
type Ext = {
  id: Id<"memberships">;
  months: string;
  amount: string;
  paid: string;
  method: "cash" | "upi";
};

function newForm(): Form {
  const start = toDateInput(Date.now());
  return {
    memberId: "",
    cabin: "",
    plan: "offer",
    amount: String(PLANS.offer.amount),
    start,
    end: toDateInput(addMonthsIST(startOfDayIST(start), 1) - 1),
  };
}

export default function MembershipsPage() {
  const [form, setForm] = useState<Form | null>(null);
  const [ext, setExt] = useState<Ext | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const members = useQuery(api.members.list, { status: "active" });
  const active = useQuery(api.memberships.listActive);
  const cabins = useQuery(api.cabins.list);
  const assign = useMutation(api.memberships.assign);
  const renew = useMutation(api.admissions.renew);
  const cancel = useMutation(api.memberships.cancel);

  const now = Date.now();
  const takenMembers = new Set(active?.map((m) => m.memberId));
  const eligible = members?.filter((m) => !takenMembers.has(m._id));
  const freeCabins = cabins?.filter((c) => c.status === "available");
  const byCabin = new Map(active?.map((m) => [m.cabinNumber, m]));
  const occupied = cabins?.filter((c) => c.status === "occupied").length ?? 0;
  const expiring =
    active?.filter((m) => m.endDate - now <= 7 * DAY).length ?? 0;

  const set = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((f) => (f ? { ...f, [k]: v } : f));

  function changeStart(start: string) {
    if (!start) return set("start", start);
    setForm(
      (f) =>
        f && {
          ...f,
          start,
          end: toDateInput(addMonthsIST(startOfDayIST(start), 1) - 1),
        },
    );
  }

  async function run<T>(
    fn: () => Promise<Result<T>>,
    after?: (data: T) => void,
  ) {
    setBusy(true);
    setError("");
    const r = await attempt(fn(), setError);
    setBusy(false);
    if (r) after?.(r.data);
  }

  function save() {
    if (!form) return;
    if (!form.memberId || !form.cabin)
      return setError("Choose a member and a cabin");
    if (!form.start || !form.end || form.amount.trim() === "")
      return setError("Fill in the dates and amount");
    run(
      () =>
        assign({
          memberId: form.memberId as Id<"members">,
          cabinNumber: Number(form.cabin),
          plan: form.plan,
          amountDue: Number(form.amount),
          startDate: startOfDayIST(form.start),
          endDate: endOfDayIST(form.end),
        }),
      () => setForm(null),
    );
  }

  function days(endDate: number) {
    const d = Math.ceil((endDate - now) / DAY);
    if (d < 0) return { text: `Ended ${-d} day(s) ago`, warn: true };
    if (d === 0) return { text: "Ends today", warn: true };
    return { text: `${d} day(s) left`, warn: d <= 7 };
  }

  return (
    <div>
      <PageHeader
        title="Cabin bookings"
        intro="Who is sitting in which cabin, and until when. Use Renew when a student pays for more time, and End booking when they leave."
        action={
          <button
            onClick={() => {
              setError("");
              setForm(newForm());
            }}
            className="rounded-xl bg-gold px-5 py-3 font-bold text-navy"
          >
            Book a cabin
          </button>
        }
      />

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Cabins", cabins?.length],
          ["Occupied", occupied],
          ["Available", freeCabins?.length],
          ["Ending within 7 days", expiring],
        ].map(([label, value]) => (
          <div
            key={label as string}
            className="rounded-2xl border border-navy/10 bg-white p-4"
          >
            <p className="font-display text-3xl font-extrabold text-navy">
              {value ?? "…"}
            </p>
            <p className="text-sm text-navy/70">{label}</p>
          </div>
        ))}
      </div>

      {form && (
        <div className="mt-6 rounded-2xl border-2 border-gold bg-white p-5 md:p-6">
          <h2 className="font-display text-xl font-extrabold text-navy">
            Assign a cabin
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Member (active, without a membership)">
              <select
                className={input}
                value={form.memberId}
                onChange={(e) => set("memberId", e.target.value)}
              >
                <option value="">Choose…</option>
                {eligible?.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} · {m.phone}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Cabin (available)">
              <select
                className={input}
                value={form.cabin}
                onChange={(e) => set("cabin", e.target.value)}
              >
                <option value="">Choose…</option>
                {freeCabins?.map((c) => (
                  <option key={c.number} value={c.number}>
                    Cabin {c.number}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Plan">
              <select
                className={input}
                value={form.plan}
                onChange={(e) =>
                  setForm(
                    (f) =>
                      f && {
                        ...f,
                        plan: e.target.value as PlanKey,
                        amount: String(PLANS[e.target.value as PlanKey].amount),
                      },
                  )
                }
              >
                {(Object.keys(PLANS) as PlanKey[]).map((k) => (
                  <option key={k} value={k}>
                    {PLANS[k].label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Amount due (₹)">
              <input
                className={input}
                inputMode="numeric"
                value={form.amount}
                onChange={(e) =>
                  set("amount", e.target.value.replace(/\D/g, ""))
                }
              />
            </Field>
            <Field label="Start date">
              <input
                className={input}
                type="date"
                value={form.start}
                onChange={(e) => changeStart(e.target.value)}
              />
            </Field>
            <Field label="End date">
              <input
                className={input}
                type="date"
                value={form.end}
                onChange={(e) => set("end", e.target.value)}
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
                setError("");
              }}
              className="rounded-xl border-2 border-navy px-5 py-3 font-bold text-navy"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!form && error && (
        <p role="alert" className="mt-4 font-semibold text-cabin">
          {error}
        </p>
      )}

      <h2 className="mt-10 font-display text-xl font-extrabold text-navy">
        Active memberships
      </h2>
      <ul className="mt-4 space-y-3">
        {active === undefined && <li className="text-navy/70">Loading…</li>}
        {active?.length === 0 && (
          <li className="text-navy/70">No active memberships yet.</li>
        )}
        {active?.map((m) => {
          const d = days(m.endDate);
          return (
            <li
              key={m._id}
              className="rounded-2xl border border-navy/10 bg-white p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-extrabold text-navy">
                    {m.memberName}{" "}
                    <span className="text-cabin">· Cabin {m.cabinNumber}</span>
                  </p>
                  <p className="text-sm text-navy/70">
                    {formatDate(m.startDate)} to {formatDate(m.endDate)} ·{" "}
                    <span className={d.warn ? "font-bold text-cabin" : ""}>
                      {d.text}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setError("");
                      setNotice("");
                      setExt({
                        id: m._id,
                        months: "1",
                        amount: String(PLANS.monthly.amount),
                        paid: String(PLANS.monthly.amount),
                        method: "cash",
                      });
                    }}
                  >
                    Renew
                  </button>
                  <button
                    onClick={() =>
                      window.confirm(
                        `End ${m.memberName}'s membership and free cabin ${m.cabinNumber}?`,
                      ) && run(() => cancel({ id: m._id }))
                    }
                    className="rounded-lg border border-navy/20 px-4 py-2 text-sm font-semibold text-navy"
                  >
                    End booking
                  </button>
                </div>
              </div>
              {ext?.id === m._id && (
                <div className="mt-4 space-y-4 border-t border-navy/10 pt-4">
                  <p className="text-sm text-navy/70">
                    Renewing adds time to this booking and records the fee
                    received.
                  </p>
                  <div className="flex flex-wrap items-end gap-3">
                    <Field
                      label="Months to add"
                      hint="Added after the current end date."
                    >
                      <input
                        className={`${input} w-24`}
                        inputMode="numeric"
                        value={ext.months}
                        onChange={(e) =>
                          setExt({
                            ...ext,
                            months: e.target.value.replace(/\D/g, ""),
                          })
                        }
                      />
                    </Field>
                    <Field
                      label="Fee for these months (₹)"
                      hint="Added to the amount due."
                    >
                      <input
                        className={`${input} w-36`}
                        inputMode="numeric"
                        value={ext.amount}
                        onChange={(e) =>
                          setExt({
                            ...ext,
                            amount: e.target.value.replace(/\D/g, ""),
                            paid:
                              ext.paid === ext.amount
                                ? e.target.value.replace(/\D/g, "")
                                : ext.paid,
                          })
                        }
                      />
                    </Field>
                    <Field label="Received now (₹)" hint="0 if they pay later.">
                      <input
                        className={`${input} w-36`}
                        inputMode="numeric"
                        value={ext.paid}
                        onChange={(e) =>
                          setExt({
                            ...ext,
                            paid: e.target.value.replace(/\D/g, ""),
                          })
                        }
                      />
                    </Field>
                    <Field label="How did they pay?">
                      <select
                        className={`${input} w-32`}
                        value={ext.method}
                        onChange={(e) =>
                          setExt({
                            ...ext,
                            method: e.target.value as "cash" | "upi",
                          })
                        }
                      >
                        <option value="cash">Cash</option>
                        <option value="upi">UPI</option>
                      </select>
                    </Field>
                  </div>
                  <div className="flex gap-3">
                    <button
                      disabled={busy}
                      onClick={() =>
                        run(
                          () =>
                            renew({
                              id: ext.id,
                              months: Number(ext.months),
                              amount: Number(ext.amount || 0),
                              paidNow: Number(ext.paid || 0),
                              method: ext.method,
                            }),
                          (d) => {
                            setNotice(
                              `${d.memberName} renewed until ${formatDate(d.endDate)}.${d.receiptNo ? ` Receipt ${d.receiptNo}.` : " No fee recorded."}${d.balance > 0 ? ` ₹${d.balance} still due.` : ""}`,
                            );
                            setExt(null);
                          },
                        )
                      }
                      className="rounded-xl bg-navy px-5 py-3 font-bold text-white disabled:opacity-60"
                    >
                      Renew and save fee
                    </button>
                    <button
                      onClick={() => setExt(null)}
                      className="rounded-xl border-2 border-navy px-5 py-3 font-bold text-navy"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <h2 className="mt-10 font-display text-xl font-extrabold text-navy">
        All cabins
      </h2>
      <div className="mt-4 grid grid-cols-6 gap-2 sm:grid-cols-9 md:grid-cols-12">
        {cabins?.map((c) => {
          const m = byCabin.get(c.number);
          return (
            <div
              key={c.number}
              title={
                m ? `${m.memberName} until ${formatDate(m.endDate)}` : c.status
              }
              className={`grid aspect-square place-items-center rounded-lg font-display font-extrabold ${
                c.status === "occupied"
                  ? "bg-cabin text-white"
                  : c.status === "maintenance"
                    ? "bg-navy/20 text-navy"
                    : "border border-navy/20 bg-white text-navy"
              }`}
            >
              {c.number}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-navy/70">
        Red cabins are occupied. Hover over one to see who has it.
      </p>
    </div>
  );
}
