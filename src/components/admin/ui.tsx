import { ConvexError } from "convex/values";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Result } from "../../../convex/lib/result";

export const input =
  "w-full rounded-xl border border-navy/20 bg-white px-4 py-3 text-navy outline-none focus:border-gold";

export function errorText(e: unknown) {
  return e instanceof ConvexError && typeof e.data === "string"
    ? e.data
    : "Something went wrong. Please try again.";
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm font-semibold text-navy">
      {label}
      <div className="mt-1 font-normal">{children}</div>
      {hint && (
        <span className="mt-1 block text-xs font-normal text-navy/60">
          {hint}
        </span>
      )}
    </label>
  );
}

export function PageHeader({
  title,
  intro,
  action,
}: {
  title: string;
  intro?: string;
  action?: ReactNode;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-extrabold text-navy">
          {title}
        </h1>
        {action}
      </div>
      {intro && <p className="mt-2 max-w-2xl text-navy/70">{intro}</p>}
    </div>
  );
}

const variants = {
  primary: "bg-navy text-white",
  gold: "bg-gold text-navy",
  outline: "border-2 border-navy text-navy",
  quiet: "border border-navy/20 text-navy",
} as const;

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
}) {
  return (
    <button
      className={cn(
        "rounded-xl px-5 py-3 font-bold transition disabled:opacity-60",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-navy/10 bg-white p-4 md:p-5",
        className,
      )}
      {...props}
    />
  );
}

export function Alert({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="font-semibold text-cabin">
      {children}
    </p>
  );
}

export async function attempt<T>(
  promise: Promise<Result<T>>,
  setError: (m: string) => void,
) {
  try {
    const r = await promise;
    if (!r.ok) {
      setError(r.error);
      return undefined;
    }
    return { data: r.data };
  } catch {
    setError("Something went wrong. Please try again.");
    return undefined;
  }
}
export function SkeletonRows({ rows = 3 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <li
          key={i}
          aria-hidden
          className="h-20 animate-pulse rounded-2xl bg-navy/10"
        />
      ))}
    </>
  );
}

export function EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <Card className="border-dashed py-8 text-center">
      <p className="font-display text-lg font-extrabold text-navy">{title}</p>
      {text && <p className="mt-1 text-navy/70">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </Card>
  );
}
