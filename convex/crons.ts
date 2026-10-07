import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// 19:00 UTC = 00:30 IST
crons.daily(
  "expire memberships",
  { hourUTC: 19, minuteUTC: 0 },
  internal.memberships.expireDue,
);

export default crons;
