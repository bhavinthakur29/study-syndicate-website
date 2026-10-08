"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { PLANS, type PlanKey } from "../../../../convex/lib/plans";
import {
  addMonthsIST,
  endOfDayIST,
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
  attempt,
  input,
} from "@/components/admin/ui";
import { receiptText, studentWhatsApp } from "@/components/admin/whatsapp";

type Form = {
  mode: "new" | "existing";
  memberId: string;
  name: string;
  phone: string;
  exam: string;
  isMinor: boolean;
  guardianName: string;
  guardianPhone: string;
  cabin: string;
  plan: PlanKey;
  amountDue: string;
  start: string;
  end: string;
  paid: string;
  method: "cash" | "upi";
  reference: string;
  paidOn: string;
};

const endFor = (start: string) =>
  toDateInput(addMonthsIST(startOfDayIST(start), 1) - 1);
const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function blank(): Form {
  const today = toDateInput(Date.now());
  return {
    mode: "new",
    memberId: "",
    name: "",
    phone: "",
    exam: "",
    isMinor: false,
    guardianName: "",
    guardianPhone: "",
    cabin: "",
    plan: "offer",
    amountDue: String(PLANS.offer.amount),
    start: today,
    end: endFor(today),
    paid: String(PLANS.offer.amount),
    method: "cash",
    reference: "",
    paidOn: today,
  };
}

type Done = {
  memberName: string;
  phone: string;
  cabinNumber: number;
  endDate: number;
  receiptNo: string | null;
  paid: number;
  balance: number;
  method: string;
  paidDate: string;
};

export default function AdmitPage() {
  const [f, setF] = useState<Form>(blank);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<Done | null>(null);
  const [copied, setCopied] = useState(false);

  const members = useQuery(api.members.list, { status: "active" });
  const cabins = useQuery(api.cabins.list);
  const admit = useMutation(api.admissions.admit);

  const eligible = members?.filter((m) => !m.hasActiveMembership);
  const freeCabins = cabins?.filter((c) => c.status === "available");
  const set = <K extends keyof Form>(k: K, v: Form[K]) =>
    setF((x) => ({ ...x, [k]: v }));

  function setPlan(plan: PlanKey) {
    const amount = String(PLANS[plan].amount);
    setF((x) => ({ ...x, plan, amountDue: amount, paid: amount }));
  }

  function setAmountDue(value: string) {
    const clean = value.replace(/\D/g, "");
    setF((x) => ({
      ...x,
      amountDue: clean,
      paid: x.paid === x.amountDue ? clean : x.paid,
    }));
  }

  async function submit() {
    if (
      f.mode === "existing" ? !f.memberId : !f.name.trim() || !f.phone.trim()
    ) {
      return setError(
        f.mode === "existing"
          ? "Choose the student"
          : "Enter the student's name and mobile number",
      );
    }
    if (!f.cabin) return setError("Choose a cabin");
    if (!f.start || !f.end) return setError("Choose the start and end dates");
    if (f.amountDue === "") return setError("Enter the amount due");

    const paid = Number(f.paid || 0);
    const today = toDateInput(Date.now());
    const paidOn =
      f.paidOn === today
        ? Date.now()
        : startOfDayIST(f.paidOn) + 12 * 3_600_000;

    setBusy(true);
    setError("");
    const r = await attempt(
      admit({
        memberId:
          f.mode === "existing" ? (f.memberId as Id<"members">) : undefined,
        newMember:
          f.mode === "new"
            ? {
                name: f.name,
                phone: f.phone,
                exam: f.exam || undefined,
                isMinor: f.isMinor,
                guardianName: f.guardianName || undefined,
                guardianPhone: f.guardianPhone || undefined,
              }
            : undefined,
        cabinNumber: Number(f.cabin),
        plan: f.plan,
        amountDue: Number(f.amountDue),
        startDate: startOfDayIST(f.start),
        endDate: endOfDayIST(f.end),
        paidNow: paid,
        method: f.method,
        reference: f.method === "upi" && f.reference ? f.reference : undefined,
        paidOn,
      }),
      setError,
    );
    setBusy(false);
    if (r)
      setDone({ ...r.data, method: f.method, paidDate: formatDate(paidOn) });
  }

  if (done) {
    const text = done.receiptNo
      ? receiptText({
          receiptNo: done.receiptNo,
          name: done.memberName,
          cabin: done.cabinNumber,
          amount: done.paid,
          method: done.method,
          date: done.paidDate,
        })
      : "";
    return (
      <div>
        <PageHeader title="Admission complete" />
        <Card className="mt-6 space-y-3 border-2 border-gold">
          <p className="font-display text-xl font-extrabold text-navy">
            {done.memberName} is now in Cabin {done.cabinNumber} until{" "}
            {formatDate(done.endDate)}.
          </p>
          <p className="text-navy/80">
            {done.receiptNo
              ? `Fee of ${rupees(done.paid)} received. Receipt ${done.receiptNo}.`
              : "No fee recorded yet."}
            {done.balance > 0 &&
              ` ${rupees(done.balance)} is still due. Record it later on the Fees page.`}
          </p>
          <div className="flex flex-wrap gap-3">
            {done.receiptNo && (
              <>
                <Button
                  variant="quiet"
                  onClick={async () => {
                    await navigator.clipboard.writeText(text);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  {copied ? "Copied" : "Copy receipt"}
                </Button>
                <a
                  href={studentWhatsApp(done.phone, text)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-gold px-5 py-3 font-bold text-navy"
                >
                  Send receipt on WhatsApp
                </a>
              </>
            )}
            <Button
              variant="outline"
              onClick={() => {
                setDone(null);
                setF(blank());
              }}
            >
              Admit another student
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="New admission"
        intro="Use this when a student joins and takes a cabin. It adds the student, books the cabin and records the fee in one go. Entering someone who joined earlier? Set their real start date and payment date below."
      />

      <Card className="mt-6 space-y-6 md:p-6">
        <section>
          <h2 className="font-display text-lg font-extrabold text-navy">
            1. Student
          </h2>
          <div className="mt-3 flex gap-2">
            {(["new", "existing"] as const).map((m) => (
              <Button
                key={m}
                variant={f.mode === m ? "primary" : "quiet"}
                className="px-4 py-2 text-sm"
                onClick={() => set("mode", m)}
              >
                {m === "new" ? "New student" : "Already in the list"}
              </Button>
            ))}
          </div>

          {f.mode === "existing" ? (
            <div className="mt-4 max-w-md">
              <Field
                label="Choose the student"
                hint="Only students without a current cabin booking are shown."
              >
                <select
                  className={input}
                  value={f.memberId}
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
            </div>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field
                label="Full name"
                hint="As the student wants it on the receipt."
              >
                <input
                  className={input}
                  placeholder="e.g. Rohan Sharma"
                  value={f.name}
                  maxLength={80}
                  onChange={(e) => set("name", e.target.value)}
                />
              </Field>
              <Field
                label="Mobile number"
                hint="10-digit number. It is also how we find the student later."
              >
                <input
                  className={input}
                  inputMode="tel"
                  placeholder="e.g. 98765 43210"
                  value={f.phone}
                  maxLength={16}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </Field>
              <Field
                label="Exam preparing for (optional)"
                hint="Helps with doubt sessions and mock tests."
              >
                <input
                  className={input}
                  placeholder="e.g. SSC CGL, JKSSB"
                  value={f.exam}
                  maxLength={80}
                  onChange={(e) => set("exam", e.target.value)}
                />
              </Field>
              <label className="flex items-center gap-2 self-center text-sm font-semibold text-navy">
                <input
                  type="checkbox"
                  className="size-4"
                  checked={f.isMinor}
                  onChange={(e) => set("isMinor", e.target.checked)}
                />
                Student is under 18
              </label>
              {f.isMinor && (
                <>
                  <Field
                    label="Parent or guardian name"
                    hint="Required for students under 18."
                  >
                    <input
                      className={input}
                      placeholder="e.g. Suresh Sharma"
                      value={f.guardianName}
                      maxLength={80}
                      onChange={(e) => set("guardianName", e.target.value)}
                    />
                  </Field>
                  <Field
                    label="Guardian mobile number"
                    hint="Required for students under 18."
                  >
                    <input
                      className={input}
                      inputMode="tel"
                      placeholder="e.g. 98765 43210"
                      value={f.guardianPhone}
                      maxLength={16}
                      onChange={(e) => set("guardianPhone", e.target.value)}
                    />
                  </Field>
                </>
              )}
            </div>
          )}
        </section>

        <section>
          <h2 className="font-display text-lg font-extrabold text-navy">
            2. Cabin and dates
          </h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <Field label="Cabin" hint="Only free cabins are shown.">
              <select
                className={input}
                value={f.cabin}
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
            <Field label="Plan" hint="Picking a plan fills in the amount.">
              <select
                className={input}
                value={f.plan}
                onChange={(e) => setPlan(e.target.value as PlanKey)}
              >
                {(Object.keys(PLANS) as PlanKey[]).map((k) => (
                  <option key={k} value={k}>
                    {PLANS[k].label} ({rupees(PLANS[k].amount)})
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label="Start date"
              hint="Today for new students. The real joining date for existing ones."
            >
              <input
                className={input}
                type="date"
                value={f.start}
                onChange={(e) =>
                  setF((x) => ({
                    ...x,
                    start: e.target.value,
                    end: e.target.value ? endFor(e.target.value) : x.end,
                  }))
                }
              />
            </Field>
            <Field
              label="Paid up to"
              hint="Set automatically to one month. Change it if they paid for longer."
            >
              <input
                className={input}
                type="date"
                value={f.end}
                onChange={(e) => set("end", e.target.value)}
              />
            </Field>
            <Field
              label="Total fee for this period (₹)"
              hint="Change it only if you agreed a different fee."
            >
              <input
                className={input}
                inputMode="numeric"
                value={f.amountDue}
                onChange={(e) => setAmountDue(e.target.value)}
              />
            </Field>
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-extrabold text-navy">
            3. Fee received
          </h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <Field
              label="Received now (₹)"
              hint="Enter 0 if they will pay later, or less than the total for a part payment."
            >
              <input
                className={input}
                inputMode="numeric"
                value={f.paid}
                onChange={(e) => set("paid", e.target.value.replace(/\D/g, ""))}
              />
            </Field>
            <Field label="How did they pay?">
              <select
                className={input}
                value={f.method}
                onChange={(e) =>
                  set("method", e.target.value as "cash" | "upi")
                }
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
              </select>
            </Field>
            {f.method === "upi" && (
              <Field
                label="UPI reference (optional)"
                hint="The transaction ID from the payment screenshot."
              >
                <input
                  className={input}
                  placeholder="e.g. 4123 5678 9012"
                  value={f.reference}
                  maxLength={40}
                  onChange={(e) => set("reference", e.target.value)}
                />
              </Field>
            )}
            <Field
              label="Payment date"
              hint="Today, unless you are entering an older payment."
            >
              <input
                className={input}
                type="date"
                max={toDateInput(Date.now())}
                value={f.paidOn}
                onChange={(e) => set("paidOn", e.target.value)}
              />
            </Field>
          </div>
        </section>

        {error && <Alert>{error}</Alert>}
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="gold" disabled={busy} onClick={submit}>
            {busy ? "Saving…" : "Admit student and save fee"}
          </Button>
          <p className="text-sm text-navy/60">
            Nothing is saved until you press this button.
          </p>
        </div>
      </Card>
    </div>
  );
}
