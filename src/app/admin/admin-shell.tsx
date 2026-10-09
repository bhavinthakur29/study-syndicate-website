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
import { SignIn, SignOutButton, useUser } from "@clerk/nextjs";
import {
  DoorOpen,
  Download,
  ExternalLink,
  HelpCircle,
  IndianRupee,
  LayoutDashboard,
  Menu,
  ScrollText,
  UserPlus,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { cn } from "@/lib/utils";

// Add a line here whenever a new admin page is built.
const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/admit", label: "New admission", icon: UserPlus },
  { href: "/admin/memberships", label: "Cabin bookings", icon: DoorOpen },
  { href: "/admin/payments", label: "Fees", icon: IndianRupee },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/audit", label: "Activity History", icon: ScrollText },
  { href: "/admin/backup", label: "Backup", icon: Download },
  { href: "/admin/help", label: "How it works", icon: HelpCircle },
];
type Me = { name: string; email: string; role: string };

function SignOutConfirm() {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        onClick={() => ref.current?.showModal()}
        className="w-full rounded-xl border border-white/20 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/10"
      >
        Sign out
      </button>
      <dialog
        ref={ref}
        className="m-auto w-[min(24rem,90vw)] rounded-2xl bg-white p-6 text-navy backdrop:bg-black/55"
      >
        <h2 className="font-display text-xl font-extrabold">Sign out?</h2>
        <p className="mt-2 text-navy/70">
          You will need to sign in with Google again to use the admin.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <SignOutButton>
            <button className="rounded-xl bg-navy px-5 py-3 font-bold text-white">
              Yes, sign out
            </button>
          </SignOutButton>
          <button
            onClick={() => ref.current?.close()}
            className="rounded-xl border-2 border-navy px-5 py-3 font-bold text-navy"
          >
            Stay signed in
          </button>
        </div>
      </dialog>
    </>
  );
}

function AuthFrame({ children }: { children: ReactNode }) {
  return (
    <div className="hero-bg grid min-h-screen place-items-center p-5 text-white">
      <div className="w-full max-w-md text-center">
        <Image
          src="/site-logo.png"
          alt=""
          width={256}
          height={256}
          className="mx-auto h-16 w-auto"
        />
        <p className="mt-4 font-display text-2xl font-extrabold">
          The Study Syndicate
        </p>
        <p className="text-white/70">Staff area</p>
        <div className="mt-6 flex justify-center">{children}</div>
      </div>
    </div>
  );
}

function SidebarContent({
  me,
  onNavigate,
}: {
  me: Me;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { user } = useUser();

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

      <div className="space-y-3 border-t border-white/10 p-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-sm text-white/70 hover:text-white"
        >
          <ExternalLink className="size-4" aria-hidden /> View website
        </Link>

        <Link
          href="/admin/account"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl p-2 hover:bg-white/10"
        >
          {user?.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.imageUrl} alt="" className="size-9 rounded-full" />
          ) : (
            <span className="grid size-9 place-items-center rounded-full bg-gold font-bold text-navy">
              {me.name.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="min-w-0 text-sm">
            <p className="truncate font-semibold">{me.name}</p>
            <p className="capitalize text-white/60">{me.role} · My account</p>
          </div>
        </Link>

        <SignOutConfirm />
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
      <AuthFrame>
        <div className="w-full rounded-2xl bg-white p-6 text-left text-navy">
          <h1 className="font-display text-2xl font-extrabold">
            Not authorised
          </h1>
          <p className="mt-2 text-navy/70">
            This Google account doesn't have access to the admin area. Sign in
            with a different account, or ask the owner to add you.
          </p>
          <SignOutButton>
            <button className="mt-4 rounded-xl bg-navy px-5 py-3 font-bold text-white">
              Sign out
            </button>
          </SignOutButton>
        </div>
      </AuthFrame>
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
        <AuthFrame>
          <p className="text-white/70">Loading…</p>
        </AuthFrame>
      </AuthLoading>
      <Unauthenticated>
        <AuthFrame>
          <SignIn
            routing="hash"
            forceRedirectUrl="/admin"
            appearance={{
              variables: { colorPrimary: "#14193f", borderRadius: "0.75rem" },
              elements: { footerAction: { display: "none" } },
            }}
          />
        </AuthFrame>
      </Unauthenticated>
      <Authenticated>
        <Authorized>{children}</Authorized>
      </Authenticated>
    </div>
  );
}
