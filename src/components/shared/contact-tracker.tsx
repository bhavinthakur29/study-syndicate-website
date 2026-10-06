"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string>) => void };
  }
}

export function ContactTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element).closest?.("a[href]");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      let type: "call" | "whatsapp" | null = null;
      if (href.startsWith("tel:")) type = "call";
      else if (href.startsWith("https://wa.me/")) type = "whatsapp";
      if (type) window.umami?.track("contact-click", { type });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
