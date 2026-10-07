import { ConvexError } from "convex/values";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const input =
  "w-full rounded-xl border border-navy/20 bg-white px-4 py-3 text-navy outline-none focus:border-gold";

export function errorText(e: unknown) {
  return e instanceof ConvexError && typeof e.data === "string"
    ? e.data
    : "Something went wrong. Please try again.";
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm font-semibold text-navy">
      {label}
      <div className="mt-1 font-normal">{children}</div>
    </label>
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

export function PageHeader({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="font-display text-3xl font-extrabold text-navy">
        {title}
      </h1>
      {action}
    </div>
  );
}
