"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Container } from "@/components/shared/container";
import { navLinks, site } from "@/content/site";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-3">
      <Container>
        <div className="flex h-14 items-center justify-between rounded-2xl border border-navy/10 bg-white/80 px-4 shadow-sm backdrop-blur-md">
          <Link
            href="/"
            className="font-display text-lg font-extrabold tracking-tight text-navy"
          >
            The Study <span className="text-gold">Syndicate</span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-navy/70 transition-colors hover:text-navy"
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
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid size-10 place-items-center rounded-xl text-navy md:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav
            aria-label="Mobile"
            className="mt-2 rounded-2xl border border-navy/10 bg-white p-3 shadow-lg md:hidden"
          >
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 font-medium text-navy hover:bg-gold-soft"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </Container>
    </header>
  );
}
