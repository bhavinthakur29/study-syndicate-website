import { MessageCircle, Phone } from "lucide-react";
import { site, whatsappLink } from "@/content/site";

export function StickyContactBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex gap-2 border-t border-navy/10 bg-white/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <a
        href={`tel:${site.phone}`}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-navy py-3 font-bold text-white"
      >
        <Phone className="size-4" aria-hidden /> Call
      </a>
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold py-3 font-bold text-navy"
      >
        <MessageCircle className="size-4" aria-hidden /> WhatsApp
      </a>
    </div>
  );
}
