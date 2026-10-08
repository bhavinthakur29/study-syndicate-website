"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toDateInput } from "../../../../convex/lib/dates";
import {
  Alert,
  Button,
  Card,
  PageHeader,
  attempt,
} from "@/components/admin/ui";

type Rows = Record<string, string | number>[];
type Scope = "members" | "memberships" | "payments";

const headers: Record<string, string> = {
  name: "Name",
  phone: "Mobile number",
  email: "Email",
  exam: "Exam preparing for",
  under18: "Under 18",
  guardianName: "Guardian name",
  guardianPhone: "Guardian mobile",
  status: "Status",
  joined: "Joined on",
  notes: "Notes",
  member: "Student",
  cabin: "Cabin",
  plan: "Plan",
  amountDue: "Total fee (₹)",
  paid: "Paid (₹)",
  balance: "Still due (₹)",
  start: "Start date",
  end: "Paid up to",
  receiptNo: "Receipt number",
  date: "Date",
  amount: "Amount (₹)",
  method: "Paid by",
  reference: "UPI reference",
  voidReason: "Reason cancelled",
  recordedBy: "Entered by",
};

const words: Record<string, string> = {
  received: "Received",
  void: "Cancelled",
  active: "Active",
  inactive: "Inactive",
  expired: "Ended on time",
  cancelled: "Ended early",
  offer: "Opening offer",
  monthly: "Monthly",
  cash: "Cash",
  upi: "UPI",
};

const friendlyColumns = new Set(["status", "plan", "method"]);

function toCsv(rows: Rows) {
  const keys = Object.keys(rows[0]);
  // A leading = + - @ would run as a formula in Excel, so neutralise it.
  const cell = (value: string | number) => {
    let s = String(value ?? "");
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return `"${s.replace(/"/g, '""')}"`;
  };
  const head = keys.map((k) => cell(headers[k] ?? k)).join(",");
  const body = rows.map((r) =>
    keys
      .map((k) =>
        cell(friendlyColumns.has(k) ? (words[String(r[k])] ?? r[k]) : r[k]),
      )
      .join(","),
  );
  return [head, ...body].join("\r\n");
}

function download(name: string, content: string) {
  const url = URL.createObjectURL(
    new Blob([content], { type: "text/csv;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

const items: { scope: Scope; title: string; text: string; file: string }[] = [
  {
    scope: "members",
    title: "Students list",
    text: "Name, mobile number, exam and guardian details of every student.",
    file: "students",
  },
  {
    scope: "memberships",
    title: "Cabin bookings",
    text: "Who had which cabin, the dates, the fee, and what is still due.",
    file: "cabin-bookings",
  },
  {
    scope: "payments",
    title: "Fees received",
    text: "Every fee with its receipt number, date, and how it was paid.",
    file: "fees-received",
  },
];

export default function BackupPage() {
  const exportData = useMutation(api.backup.exportData);
  const [busy, setBusy] = useState<Scope | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function run(item: (typeof items)[number]) {
    setBusy(item.scope);
    setError("");
    setNotice("");
    const r = await attempt(exportData({ scope: item.scope }), setError);
    setBusy(null);
    if (!r) return;

    const rows = r.data[item.scope] as Rows;
    if (rows.length === 0)
      return setNotice("There is nothing to download yet.");
    download(
      `${item.file}-${toDateInput(Date.now())}.csv`,
      `\ufeff${toCsv(rows)}`,
    );
    setNotice(`${item.title} downloaded. Look in your Downloads folder.`);
  }

  return (
    <div>
      <PageHeader
        title="Backup"
        intro="Download a copy of your records and keep it somewhere safe, like your email or Google Drive. The files open in Excel or Google Sheets. Do this once a week."
      />

      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item.scope}>
            <Card className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display text-lg font-extrabold text-navy">
                  {item.title}
                </p>
                <p className="text-sm text-navy/70">{item.text}</p>
              </div>
              <Button
                variant="quiet"
                disabled={busy !== null}
                onClick={() => run(item)}
              >
                {busy === item.scope ? "Preparing…" : "Download"}
              </Button>
            </Card>
          </li>
        ))}
      </ul>

      {notice && (
        <p role="status" className="mt-4 font-semibold text-navy">
          {notice}
        </p>
      )}
      {error && (
        <div className="mt-4">
          <Alert>{error}</Alert>
        </div>
      )}

      <Card className="mt-8 space-y-2 text-navy/80">
        <p className="font-display text-lg font-extrabold text-navy">
          Good to know
        </p>
        <p>
          These files contain students' phone numbers. Don't share them with
          anyone, and delete old copies you no longer need.
        </p>
        <p>Each download is noted in the Activity history.</p>
      </Card>
    </div>
  );
}
