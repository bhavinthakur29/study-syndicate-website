"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { DAY, formatDate } from "../../../convex/lib/dates";
import { Card, PageHeader } from "@/components/admin/ui";
import { studentWhatsApp } from "@/components/admin/whatsapp";

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function left(endDate: number) {
  const d = Math.ceil((endDate - Date.now()) / DAY);
  if (d < 0) return `Ended ${-d} day(s) ago`;
  if (d === 0) return "Ends today";
  return `${d} day(s) left`;
}

const quick =
  "rounded-xl border border-navy/20 bg-white px-4 py-2.5 text-sm font-bold text-navy";

export default function AdminHome() {
  const s = useQuery(api.dashboard.summary);

  if (s === undefined) {
    return (
      <div>
        <PageHeader title="Dashboard" />
        <p className="mt-6 text-navy/70">Loading…</p>
      </div>
    );
  }

  const plural = (n: number, word: string) =>
    `${n} ${word}${n === 1 ? "" : "s"}`;

  const stats: { label: string; value: string; note?: string }[] = [
    { label: "Collected today", value: rupees(s.collected.today) },
    { label: "Collected this month", value: rupees(s.collected.month) },
    {
      label: "Fees still due",
      value: rupees(s.dues.total),
      note: plural(s.dues.count, "student"),
    },
    {
      label: "Cabins available",
      value: `${s.cabins.available}`,
      note: `of ${s.cabins.total}`,
    },
    {
      label: "Current bookings",
      value: `${s.activeMemberships}`,
      note: plural(s.activeMembers, "active student"),
    },
  ];
  // Only show this card when something is about to end.
  if (s.expiring.length > 0) {
    stats.push({
      label: "Ending within 7 days",
      value: `${s.expiring.length}`,
    });
  }

  return (
    <div>
      <PageHeader title="Dashboard" />

      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/admin/admit" className={`${quick} bg-gold`}>
          New admission
        </Link>
        <Link href="/admin/payments" className={quick}>
          Fee received
        </Link>
        <Link href="/admin/memberships" className={quick}>
          Cabin bookings
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
        {stats.map((x) => (
          <Card
            key={x.label}
            className="last:odd:col-span-2 md:last:odd:col-span-1"
          >
            <p className="font-display text-2xl font-extrabold text-navy md:text-3xl">
              {x.value}
            </p>
            <p className="text-sm text-navy/70">{x.label}</p>
            {x.note && <p className="text-xs text-navy/50">{x.note}</p>}
          </Card>
        ))}
      </div>

      <h2 className="mt-10 font-display text-xl font-extrabold text-navy">
        Ending soon
      </h2>
      <ul className="mt-4 space-y-3">
        {s.expiring.length === 0 && (
          <li className="text-navy/70">Nothing ends in the next 7 days.</li>
        )}
        {s.expiring.map((m) => (
          <li key={m.id}>
            <Card className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display text-lg font-extrabold text-navy">
                  {m.memberName}{" "}
                  <span className="text-cabin">· Cabin {m.cabinNumber}</span>
                </p>
                <p className="text-sm font-bold text-cabin">
                  {left(m.endDate)} · {formatDate(m.endDate)}
                </p>
              </div>
              <a
                className={quick}
                target="_blank"
                rel="noopener noreferrer"
                href={studentWhatsApp(
                  m.phone,
                  `Hello ${m.memberName}, your cabin booking at The Study Syndicate Library ends on ${formatDate(m.endDate)}. Please renew to keep Cabin ${m.cabinNumber}. Thank you!`,
                )}
              >
                Send reminder
              </a>
            </Card>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 font-display text-xl font-extrabold text-navy">
        Biggest dues
      </h2>
      <ul className="mt-4 space-y-3">
        {s.dues.top.length === 0 && (
          <li className="text-navy/70">No outstanding dues.</li>
        )}
        {s.dues.top.map((m) => (
          <li key={m.id}>
            <Card className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display text-lg font-extrabold text-navy">
                  {m.memberName}{" "}
                  <span className="text-cabin">· Cabin {m.cabinNumber}</span>
                </p>
                <p className="text-sm font-bold text-navy">
                  {rupees(m.balance)} due
                </p>
              </div>
              <a
                className={quick}
                target="_blank"
                rel="noopener noreferrer"
                href={studentWhatsApp(
                  m.phone,
                  `Hello ${m.memberName}, a fee of ₹${m.balance} is pending for your cabin at The Study Syndicate Library. Please pay when convenient. Thank you!`,
                )}
              >
                Send reminder
              </a>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
