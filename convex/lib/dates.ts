export const DAY = 86_400_000;
const IST = 19_800_000; // UTC+5:30

export const startOfDayIST = (s: string) => Date.parse(`${s}T00:00:00+05:30`);
export const endOfDayIST = (s: string) => Date.parse(`${s}T23:59:59.999+05:30`);
export const toDateInput = (ts: number) =>
  new Date(ts + IST).toISOString().slice(0, 10);

export function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Adds calendar months in IST, clamping the day (31 Jan + 1 month = 28 Feb).
export function addMonthsIST(ts: number, months: number) {
  const d = new Date(ts + IST);
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + months);
  const last = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0),
  ).getUTCDate();
  d.setUTCDate(Math.min(day, last));
  return d.getTime() - IST;
}
