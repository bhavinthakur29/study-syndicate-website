"use client";

import Image from "next/image";
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
              className="size-10 rounded-xl hidden min-[480px]:inline"
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
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid size-10 place-items-center rounded-xl text-white md:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav
            aria-label="Mobile"
            className="mt-2 rounded-2xl border border-white/15 bg-navy-deep/95 p-3 shadow-xl backdrop-blur-xl md:hidden"
          >
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 font-medium text-white hover:bg-white/10"
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
