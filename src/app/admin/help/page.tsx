import { Card, PageHeader } from "@/components/admin/ui";

const steps = [
  [
    "A student joins",
    "Open New admission. Fill in the student, choose a cabin, and enter the fee received. Send the receipt on WhatsApp.",
  ],
  [
    "A student pays more time",
    "Open Cabin bookings, press Renew on their row, and enter the months and the fee.",
  ],
  [
    "A student pays a balance later",
    "Open Fees and press Fee received. Choose the student and enter the amount.",
  ],
  [
    "A student leaves early",
    "Open Cabin bookings and press End booking. The cabin becomes free.",
  ],
  [
    "Each morning",
    "Open the Dashboard. Check what was collected, who owes money, and who is ending this week. Use Send reminder to message them.",
  ],
  [
    "Each week",
    "Open Backup and follow the steps to download a copy of your data.",
  ],
];

export default function HelpPage() {
  return (
    <div>
      <PageHeader
        title="How it works"
        intro="A short guide to the daily jobs. Nothing here is permanent until you press a Save button."
      />
      <ul className="mt-6 space-y-3">
        {steps.map(([title, text]) => (
          <li key={title}>
            <Card>
              <p className="font-display text-lg font-extrabold text-navy">
                {title}
              </p>
              <p className="mt-1 text-navy/70">{text}</p>
            </Card>
          </li>
        ))}
      </ul>
      <h2 className="mt-10 font-display text-xl font-extrabold text-navy">
        Good to know
      </h2>
      <Card className="mt-4 space-y-2 text-navy/80">
        <p>
          A fee that was recorded by mistake is never deleted. Use Void on the
          Fees page and give a reason, so the record stays honest.
        </p>
        <p>
          A student with a current cabin booking can't be deactivated. End the
          booking first.
        </p>
        <p>
          Every change is written to the Audit log, with who made it and when.
        </p>
      </Card>
    </div>
  );
}
