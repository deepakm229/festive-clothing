import Link from "next/link";
import { ArrowRight } from "lucide-react";

type HeroProps = {
  imageUrl: string;
};

export function Hero({ imageUrl }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gray-100">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: `url('${imageUrl}')`,
        }}
      />
      <div className="relative mx-auto flex max-w-7xl flex-col items-start px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted">
          Festival Season Rentals
        </p>
        <h1 className="mt-4 max-w-2xl font-serif text-4xl font-semibold leading-tight text-accent sm:text-5xl lg:text-6xl">
          Discover Beautiful Festive Wear
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
          Rent premium kurtas, lehengas, and traditional outfits for Diwali,
          Navratri, and every special occasion. Check availability and book in
          minutes.
        </p>
        <Link
          href="/clothes"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-sm font-medium uppercase tracking-widest text-white transition hover:bg-gray-800"
        >
          Start Browsing
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
