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
type Scope = "members" | "memberships" | "payments" | "everything";

function toCsv(rows: Rows) {
  const keys = Object.keys(rows[0]);
  // A leading = + - @ would run as a formula in Excel, so neutralise it.
  const cell = (value: string | number) => {
    let s = String(value ?? "");
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return `"${s.replace(/"/g, '""')}"`;
  };
  return [
    keys.join(","),
    ...rows.map((r) => keys.map((k) => cell(r[k])).join(",")),
  ].join("\r\n");
}

function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

const buttons: { scope: Scope; label: string }[] = [
  { scope: "members", label: "Members (CSV)" },
  { scope: "memberships", label: "Memberships (CSV)" },
  { scope: "payments", label: "Payments (CSV)" },
  { scope: "everything", label: "Everything (JSON)" },
];

export default function BackupPage() {
  const exportData = useMutation(api.backup.exportData);
  const [busy, setBusy] = useState<Scope | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function run(scope: Scope) {
    setBusy(scope);
    setError("");
    setNotice("");
    const r = await attempt(exportData({ scope }), setError);
    setBusy(null);
    if (!r) return;

    const stamp = toDateInput(Date.now());
    if (scope === "everything") {
      const body = { generatedAt: new Date().toISOString(), ...r.data };
      download(
        `study-syndicate-export-${stamp}.json`,
        JSON.stringify(body, null, 2),
        "application/json",
      );
    } else {
      const rows = r.data[scope] as Rows;
      if (rows.length === 0) return setNotice("Nothing to export yet.");
      download(
        `${scope}-${stamp}.csv`,
        `\ufeff${toCsv(rows)}`,
        "text/csv;charset=utf-8",
      );
    }
    setNotice(
      "Download started. The file contains personal data, so keep it private.",
    );
  }

  return (
    <div>
      <PageHeader title="Backup" />

      <h2 className="mt-8 font-display text-xl font-extrabold text-navy">
        Readable copies
      </h2>
      <p className="mt-2 text-navy/70">
        For spreadsheets and records. These are not a restore point, and every
        download is written to the audit log.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {buttons.map((b) => (
          <Button
            key={b.scope}
            variant="quiet"
            disabled={busy !== null}
            onClick={() => run(b.scope)}
          >
            {busy === b.scope ? "Preparing…" : b.label}
          </Button>
        ))}
      </div>
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

      <h2 className="mt-10 font-display text-xl font-extrabold text-navy">
        Real backup (for disasters)
      </h2>
      <Card className="mt-4 space-y-3 text-navy/80">
        <p>
          Convex's free plan keeps no automatic backups, so download one
          regularly. On the computer that runs the project:
        </p>
        <pre className="overflow-x-auto rounded-xl bg-navy-deep p-4 text-sm text-white">
          {`bunx convex export --prod --path ./backups/`}
        </pre>
        <p>
          Use <code>--prod</code> once production exists. Without it the command
          backs up the dev database. The Convex dashboard also has a Backup
          &amp; Restore page with a "Backup Now" button.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Back up weekly once real data is in, and before every big change.
          </li>
          <li>
            Keep copies off this computer, in an encrypted or password-protected
            place.
          </li>
          <li>
            Never commit a backup to Git. Delete old copies you no longer need.
          </li>
        </ul>
      </Card>
    </div>
  );
}
