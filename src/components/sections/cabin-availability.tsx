import { MessageCircle } from "lucide-react";
import { getCabinCounts } from "@/lib/cabin-counts";
import { whatsappLink } from "@/content/site";
import { cn } from "@/lib/utils";

export async function CabinAvailability() {
  const counts = await getCabinCounts();
  const available = counts ? counts.total - counts.booked : 0;

  return (
    <div>
      {counts ? (
        <>
          <p className="font-display text-5xl font-extrabold leading-none text-navy md:text-6xl">
            {available}
            <span className="text-2xl text-navy/50 md:text-3xl">
              {" "}
              of {counts.total}
            </span>
          </p>
          <p className="mt-2 font-semibold text-navy">cabins still available</p>

          <div
            role="img"
            aria-label={`${counts.booked} of ${counts.total} cabins booked, ${available} available`}
            className="mt-6 grid grid-cols-12 gap-1.5"
          >
            {Array.from({ length: counts.total }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "aspect-square rounded-[4px]",
                  i < counts.booked ? "bg-cabin" : "bg-navy/15",
                )}
              />
            ))}
          </div>

          <div className="mt-4 flex gap-5 text-sm text-navy/70">
            <span className="flex items-center gap-2">
              <span className="size-3 rounded-[3px] bg-cabin" aria-hidden />{" "}
              {counts.booked} booked
            </span>
            <span className="flex items-center gap-2">
              <span className="size-3 rounded-[3px] bg-navy/15" aria-hidden />{" "}
              {available} available
            </span>
          </div>
        </>
      ) : (
        <p className="font-display text-2xl font-extrabold text-navy">
          Ask us for today's availability
        </p>
      )}

      <a
        href={whatsappLink(
          "Hi, I want to reserve a cabin at The Study Syndicate Library.",
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-navy px-6 py-3.5 font-bold text-white transition hover:bg-navy-deep"
      >
        <MessageCircle className="size-5" aria-hidden /> Reserve your cabin
      </a>
      <p className="mt-3 text-sm text-navy/65">
        We'll confirm your cabin number on WhatsApp.
      </p>
    </div>
  );
}
