"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { q: string; a: string };

export function FaqList({ items }: { items: readonly Item[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map(({ q, a }, i) => {
        const isOpen = open === i;
        return (
          <div
            key={q}
            className={cn(
              "rounded-2xl border bg-white transition-colors",
              isOpen ? "border-gold" : "border-navy/10",
            )}
          >
            <h3>
              <button
                type="button"
                id={`faq-btn-${i}`}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left font-display text-lg font-extrabold text-navy"
              >
                {q}
                <ChevronDown
                  className={cn(
                    "size-5 shrink-0 text-cabin transition-transform duration-300 motion-reduce:transition-none",
                    isOpen && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>
            </h3>
            <div
              id={`faq-panel-${i}`}
              role="region"
              aria-labelledby={`faq-btn-${i}`}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <p className="px-5 pb-5 leading-relaxed text-navy/70">{a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
