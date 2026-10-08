"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, PageHeader, input } from "@/components/admin/ui";

const entities = [
  "all",
  "members",
  "memberships",
  "payments",
  "staffUsers",
  "backup",
];

const when = (ts: number) =>
  new Date(ts).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function AuditPage() {
  const logs = useQuery(api.auditLogs.recent);
  const [entity, setEntity] = useState("all");
  const [search, setSearch] = useState("");

  const q = search.trim().toLowerCase();
  const shown = logs?.filter(
    (l) =>
      (entity === "all" || l.entity === entity) &&
      (!q ||
        l.summary.toLowerCase().includes(q) ||
        l.actor.toLowerCase().includes(q)),
  );

  return (
    <div>
      <PageHeader title="Audit log" />
      <p className="mt-2 text-navy/70">
        The latest 300 actions. Only admins can see this page.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          className={`${input} max-w-xs`}
          placeholder="Search actions or people"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={`${input} max-w-[12rem]`}
          value={entity}
          onChange={(e) => setEntity(e.target.value)}
        >
          {entities.map((e) => (
            <option key={e} value={e}>
              {e === "all" ? "Everything" : e}
            </option>
          ))}
        </select>
      </div>

      <ul className="mt-6 space-y-2">
        {shown === undefined && <li className="text-navy/70">Loading…</li>}
        {shown?.length === 0 && (
          <li className="text-navy/70">Nothing matches.</li>
        )}
        {shown?.map((l) => (
          <li key={l._id}>
            <Card className="py-3">
              <p className="font-semibold text-navy">{l.summary}</p>
              <p className="text-sm text-navy/60">
                {when(l.at)} · {l.actor} · {l.action} {l.entity}
              </p>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
