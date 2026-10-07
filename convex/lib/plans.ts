// Keep these prices in sync with src/content/offer.ts (the public site).
export const PLANS = {
  offer: { label: "Opening offer", amount: 999 },
  monthly: { label: "Monthly", amount: 1200 },
} as const;

export type PlanKey = keyof typeof PLANS;
