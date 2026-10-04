"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Clock, Menu, MessageCircle, Phone, X } from "lucide-react";
import { Container } from "@/components/shared/container";
import { navLinks, site, whatsappLink } from "@/content/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items =
        panelRef.current.querySelectorAll<HTMLElement>("a[href], button");
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const mq = window.matchMedia("(min-width: 768px)");
    const onResize = () => {
      if (mq.matches) setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onResize);
    const menuBtn = menuBtnRef.current;

    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onResize);
      menuBtn?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-[60] pt-3">
      <Container>
        <div className="flex h-14 items-center justify-between rounded-2xl border border-white/15 bg-navy-deep/70 px-3 shadow-lg shadow-black/20 backdrop-blur-xl">
          <Link
            href="/"
            className="flex items-center gap-2.5"
            aria-label={`${site.name} home`}
          >
            <Image
              src="/site-logo.svg"
              alt=""
              width={40}
              height={40}
              priority
              className="size-10 rounded-xl"
            />
            <span className="font-display text-lg font-extrabold leading-none tracking-tight text-white">
              The Study <span className="text-gold">Syndicate</span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${site.phone}`}
              className="hidden items-center gap-2 rounded-xl bg-gold px-4 py-2 text-sm font-bold text-navy transition hover:brightness-95 sm:inline-flex"
            >
              <Phone className="size-4" aria-hidden /> Call now
            </a>
            <button
              ref={menuBtnRef}
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
              className="grid size-10 place-items-center rounded-xl text-white md:hidden"
            >
              <Menu className="size-6" />
            </button>
          </div>
        </div>
      </Container>

      {/* Off-canvas menu: kept outside the blurred bar so fixed positioning stays relative to the screen */}
      <div
        aria-hidden
        onClick={close}
        className={cn(
          "fixed inset-0 bg-black/55 transition-opacity duration-300 motion-reduce:transition-none md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <div
        ref={panelRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
        className={cn(
          "hero-bg fixed inset-y-0 right-0 flex w-[min(20rem,86vw)] flex-col rounded-l-3xl px-6 pb-6 pt-5 text-white shadow-2xl",
          "transition-transform duration-300 ease-out motion-reduce:transition-none md:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-extrabold">Menu</span>
          <button
            ref={closeBtnRef}
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="grid size-10 place-items-center rounded-xl bg-white/10 text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav aria-label="Mobile" className="mt-8 flex flex-col">
          {navLinks.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={close}
              style={{ transitionDelay: open ? `${120 + i * 50}ms` : "0ms" }}
              className={cn(
                "border-b border-white/10 py-4 font-display text-2xl font-extrabold transition-all duration-300 motion-reduce:transition-none",
                open ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-3 pt-8">
          <p className="flex items-center gap-2 text-sm text-white/70">
            <Clock className="size-4 text-gold" aria-hidden /> {site.hours}
          </p>
          <a
            href={`tel:${site.phone}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-white/10 py-3.5 font-bold"
          >
            <Phone className="size-4" aria-hidden /> Call {site.phoneDisplay}
          </a>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-gold py-3.5 font-bold text-navy"
          >
            <MessageCircle className="size-4" aria-hidden /> WhatsApp us
          </a>
        </div>
      </div>
    </header>
  );
}
