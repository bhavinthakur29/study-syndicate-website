import { ConvexError } from "convex/values";

export function text(
  value: string | undefined,
  label: string,
  max: number,
  required = false,
) {
  const t = (value ?? "").trim();
  if (required && t.length < 2) throw new ConvexError(`${label} is required`);
  if (t.length > max) throw new ConvexError(`${label} is too long`);
  return t === "" ? undefined : t;
}

export function phone(value: string, label: string) {
  let d = value.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  else if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  if (!/^[6-9]\d{9}$/.test(d)) {
    throw new ConvexError(`${label} must be a valid 10-digit mobile number`);
  }
  return d;
}

export function email(value?: string) {
  const t = (value ?? "").trim().toLowerCase();
  if (!t) return undefined;
  if (t.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) {
    throw new ConvexError("Email looks invalid");
  }
  return t;
}
