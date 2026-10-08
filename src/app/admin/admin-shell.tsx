"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AuthLoading,
  Authenticated,
  Unauthenticated,
  useQuery,
} from "convex/react";
import { SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import {
  DoorOpen,
  Download,
  ExternalLink,
  IndianRupee,
  LayoutDashboard,
  Menu,
  ScrollText,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { cn } from "@/lib/utils";

// Add a line here whenever a new admin page is built.
const nav: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/memberships", label: "Memberships", icon: DoorOpen },
  { href: "/admin/payments", label: "Payments", icon: IndianRupee },
  { href: "/admin/audit", label: "Audit log", icon: ScrollText },
  { href: "/admin/backup", label: "Backup", icon: Download },
];

type Me = { name: string; email: string; role: string };

function SidebarContent({
  me,
  onNavigate,
}: {
  me: Me;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <Link
        href="/admin"
        onClick={onNavigate}
        className="flex items-center gap-2.5 px-5 py-5"
      >
        <Image
          src="/site-logo.png"
          alt=""
          width={256}
          height={256}
          className="h-9 w-auto"
        />
        <span className="font-display text-lg font-extrabold">Admin</span>
      </Link>

      <nav aria-label="Admin" className="flex-1 space-y-1 px-3">
        {nav.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/admin" && pathname.startsWith(`${href}/`));
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition-colors",
                active
                  ? "bg-gold text-navy"
                  : "text-white/75 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="size-5" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-4 border-t border-white/10 p-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-sm text-white/70 hover:text-white"
        >
          <ExternalLink className="size-4" aria-hidden /> View website
        </Link>
        <div className="flex items-center gap-3">
          <UserButton />
          <div className="min-w-0 text-sm">
            <p className="truncate font-semibold">{me.name}</p>
            <p className="capitalize text-white/60">{me.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Authorized({ children }: { children: ReactNode }) {
  const me = useQuery(api.staff.me);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    const menuBtn = menuRef.current;

    return () => {
      root.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
      menuBtn?.focus();
    };
  }, [open]);

  if (me === undefined)
    return <p className="p-6 text-navy/70">Checking access…</p>;

  if (me === null) {
    return (
      <div className="p-5 md:p-8">
        <div className="max-w-md rounded-2xl border border-navy/10 bg-white p-6">
          <h1 className="font-display text-2xl font-extrabold text-navy">
            Not authorised
          </h1>
          <p className="mt-2 text-navy/70">
            This account doesn't have access to the admin area.
          </p>
          <SignOutButton>
            <button className="mt-4 rounded-xl bg-navy px-5 py-3 font-bold text-white">
              Sign out
            </button>
          </SignOutButton>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-navy-deep text-white md:block">
        <SidebarContent me={me} />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-navy/10 bg-paper/95 px-4 py-3 backdrop-blur md:hidden">
        <button
          ref={menuRef}
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="admin-drawer"
          onClick={() => setOpen(true)}
          className="grid size-10 place-items-center rounded-xl text-navy"
        >
          <Menu className="size-6" />
        </button>
        <span className="font-display text-lg font-extrabold text-navy">
          Admin
        </span>
      </header>

      {/* Mobile drawer */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/55 transition-opacity duration-300 motion-reduce:transition-none md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        id="admin-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Admin menu"
        inert={!open}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[min(18rem,85vw)] bg-navy-deep text-white shadow-2xl",
          "transition-transform duration-300 ease-out motion-reduce:transition-none md:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <button
          ref={closeRef}
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="absolute right-3 top-4 grid size-10 place-items-center rounded-xl bg-white/10"
        >
          <X className="size-5" />
        </button>
        <SidebarContent me={me} onNavigate={() => setOpen(false)} />
      </aside>

      <main className="md:pl-64">
        <div className="mx-auto max-w-5xl p-5 md:p-8">{children}</div>
      </main>
    </>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <AuthLoading>
        <p className="p-6 text-navy/70">Loading…</p>
      </AuthLoading>
      <Unauthenticated>
        <div className="p-5 md:p-8">
          <div className="max-w-md rounded-2xl border border-navy/10 bg-white p-6">
            <h1 className="font-display text-2xl font-extrabold text-navy">
              Staff sign-in
            </h1>
            <p className="mt-2 text-navy/70">
              Sign in with your Google account.
            </p>
            <SignInButton mode="modal">
              <button className="mt-4 rounded-xl bg-gold px-5 py-3 font-bold text-navy">
                Sign in with Google
              </button>
            </SignInButton>
          </div>
        </div>
      </Unauthenticated>
      <Authenticated>
        <Authorized>{children}</Authorized>
      </Authenticated>
    </div>
  );
}
