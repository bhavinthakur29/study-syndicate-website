import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="hero-bg flex min-h-[80vh] items-center rounded-b-[2.5rem] pb-16 pt-32 text-white">
      <Container>
        <p className="font-display text-7xl font-extrabold text-gold sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 font-display text-3xl font-extrabold sm:text-5xl">
          This page isn't on the shelf.
        </h1>
        <p className="mt-4 max-w-md text-lg text-white/70">
          The link may be mistyped or out of date. Head back to {site.shortName}{" "}
          and pick up where you left off.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-xl bg-gold px-6 py-3.5 font-bold text-navy transition hover:brightness-95"
          >
            Back to home
          </Link>
          <a
            href={`tel:${site.phone}`}
            className="rounded-xl border-2 border-white/80 px-6 py-3.5 font-bold transition hover:bg-white hover:text-navy"
          >
            Call us
          </a>
        </div>
      </Container>
    </section>
  );
}
