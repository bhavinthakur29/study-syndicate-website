"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import {
  formatDate,
  startOfDayIST,
  toDateInput,
} from "../../../../convex/lib/dates";
import {
  Alert,
  Button,
  Card,
  Field,
  PageHeader,
  errorText,
  input,
} from "@/components/admin/ui";

type Form = {
  membershipId: string;
  amount: string;
  method: "cash" | "upi";
  reference: string;
  date: string;
};

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function PaymentsPage() {
  const [form, setForm] = useState<Form | null>(null);
  const [voidId, setVoidId] = useState<Id<"payments"> | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const active = useQuery(api.memberships.listActive);
  const payments = useQuery(api.payments.recent);
  const record = useMutation(api.payments.record);
  const voidPayment = useMutation(api.payments.voidPayment);

  const dues = active?.filter((m) => m.balance > 0);

  function openForm(membershipId = "", amount = "") {
    setError("");
    setNotice("");
    setForm({
      membershipId,
      amount,
      method: "cash",
      reference: "",
      date: toDateInput(Date.now()),
    });
  }

  function chooseMembership(id: string) {
    const m = active?.find((x) => x._id === id);
    setForm(
      (f) =>
        f && {
          ...f,
          membershipId: id,
          amount: m && m.balance > 0 ? String(m.balance) : "",
        },
    );
  }

  async function run(fn: () => Promise<unknown>, after?: () => void) {
    setBusy(true);
    setError("");
    try {
      await fn();
      after?.();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  function save() {
    if (!form) return;
    if (!form.membershipId) return setError("Choose a member");
    if (!form.amount || Number(form.amount) < 1)
      return setError("Enter the amount received");
    if (!form.date) return setError("Choose the payment date");

    const today = form.date === toDateInput(Date.now());
    const receivedAt = today
      ? Date.now()
      : startOfDayIST(form.date) + 12 * 3_600_000;

    run(
      async () => {
        const receiptNo = await record({
          membershipId: form.membershipId as Id<"memberships">,
          amount: Number(form.amount),
          method: form.method,
          reference:
            form.method === "upi" && form.reference
              ? form.reference
              : undefined,
          receivedAt,
        });
        setNotice(`Payment recorded. Receipt ${receiptNo}`);
      },
      () => setForm(null),
    );
  }

  async function copyReceipt(p: NonNullable<typeof payments>[number]) {
    const textBody = [
      `Receipt ${p.receiptNo}`,
      "The Study Syndicate Library",
      `${p.memberName}${p.cabinNumber ? `, Cabin ${p.cabinNumber}` : ""}`,
      `Amount: ${rupees(p.amount)} (${p.method.toUpperCase()})`,
      `Date: ${formatDate(p.receivedAt)}`,
      "Thank you!",
    ].join("\n");
    await navigator.clipboard.writeText(textBody);
    setCopied(p._id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div>
      <PageHeader
        title="Payments"
        action={
          <Button variant="gold" onClick={() => openForm()}>
            Record payment
          </Button>
        }
      />

      {notice && (
        <p role="status" className="mt-4 font-semibold text-navy">
          {notice}
        </p>
      )}

      {form && (
        <Card className="mt-6 border-2 border-gold md:p-6">
          <h2 className="font-display text-xl font-extrabold text-navy">
            Record a payment
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Member">
              <select
                className={input}
                value={form.membershipId}
                onChange={(e) => chooseMembership(e.target.value)}
              >
                <option value="">Choose…</option>
                {active?.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.memberName} · Cabin {m.cabinNumber} · due{" "}
                    {rupees(m.balance)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Amount received (₹)">
              <input
                className={input}
                inputMode="numeric"
                value={form.amount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    amount: e.target.value.replace(/\D/g, ""),
                  })
                }
              />
            </Field>
            <Field label="Method">
              <select
                className={input}
                value={form.method}
                onChange={(e) =>
                  setForm({ ...form, method: e.target.value as "cash" | "upi" })
                }
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
              </select>
            </Field>
            <Field label="Payment date">
              <input
                className={input}
                type="date"
                value={form.date}
                max={toDateInput(Date.now())}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </Field>
            {form.method === "upi" && (
              <Field label="UPI reference (optional)">
                <input
                  className={input}
                  value={form.reference}
                  maxLength={40}
                  onChange={(e) =>
                    setForm({ ...form, reference: e.target.value })
                  }
                />
              </Field>
            )}
          </div>
          {error && (
            <div className="mt-4">
              <Alert>{error}</Alert>
            </div>
          )}
          <div className="mt-5 flex gap-3">
            <Button onClick={save} disabled={busy}>
              {busy ? "Saving…" : "Save"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setForm(null);
                setError("");
              }}
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {!form && error && (
        <div className="mt-4">
          <Alert>{error}</Alert>
        </div>
      )}

      <h2 className="mt-10 font-display text-xl font-extrabold text-navy">
        Dues
      </h2>
      <ul className="mt-4 space-y-3">
        {dues === undefined && <li className="text-navy/70">Loading…</li>}
        {dues?.length === 0 && (
          <li className="text-navy/70">No outstanding dues.</li>
        )}
        {dues?.map((m) => (
          <li key={m._id}>
            <Card className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display text-lg font-extrabold text-navy">
                  {m.memberName}{" "}
                  <span className="text-cabin">· Cabin {m.cabinNumber}</span>
                </p>
                <p className="text-sm text-navy/70">
                  Due {rupees(m.balance)} of {rupees(m.amountDue)} · ends{" "}
                  {formatDate(m.endDate)}
                </p>
              </div>
              <Button
                variant="quiet"
                className="px-4 py-2 text-sm"
                onClick={() => openForm(m._id, String(m.balance))}
              >
                Record payment
              </Button>
            </Card>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 font-display text-xl font-extrabold text-navy">
        Recent payments
      </h2>
      <ul className="mt-4 space-y-3">
        {payments === undefined && <li className="text-navy/70">Loading…</li>}
        {payments?.length === 0 && (
          <li className="text-navy/70">No payments recorded yet.</li>
        )}
        {payments?.map((p) => (
          <li key={p._id}>
            <Card className={p.status === "void" ? "opacity-70" : ""}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-extrabold text-navy">
                    <span className={p.status === "void" ? "line-through" : ""}>
                      {rupees(p.amount)}
                    </span>
                    <span className="ml-2 text-base font-semibold text-navy/70">
                      {p.memberName}
                    </span>
                    {p.status === "void" && (
                      <span className="ml-2 rounded-full bg-cabin px-2 py-0.5 text-xs font-bold text-white">
                        Void
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-navy/70">
                    {p.receiptNo} · {p.method.toUpperCase()} ·{" "}
                    {formatDate(p.receivedAt)}
                    {p.reference ? ` · ${p.reference}` : ""}
                  </p>
                  {p.status === "void" && (
                    <p className="text-sm text-cabin">Reason: {p.voidReason}</p>
                  )}
                </div>
                {p.status === "received" && (
                  <div className="flex gap-2">
                    <Button
                      variant="quiet"
                      className="px-4 py-2 text-sm"
                      onClick={() => copyReceipt(p)}
                    >
                      {copied === p._id ? "Copied" : "Copy receipt"}
                    </Button>
                    <Button
                      variant="quiet"
                      className="px-4 py-2 text-sm"
                      onClick={() => {
                        setError("");
                        setReason("");
                        setVoidId(p._id);
                      }}
                    >
                      Void
                    </Button>
                  </div>
                )}
              </div>
              {voidId === p._id && (
                <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-navy/10 pt-4">
                  <Field label="Reason for voiding">
                    <input
                      className={`${input} w-72 max-w-full`}
                      value={reason}
                      maxLength={200}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </Field>
                  <Button
                    disabled={busy}
                    onClick={() =>
                      run(
                        () => voidPayment({ id: p._id, reason }),
                        () => {
                          setVoidId(null);
                          setReason("");
                        },
                      )
                    }
                  >
                    Confirm void
                  </Button>
                  <Button variant="outline" onClick={() => setVoidId(null)}>
                    Cancel
                  </Button>
                </div>
              )}
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
