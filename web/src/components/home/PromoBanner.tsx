import Link from "next/link";
import { SITE_IMAGES } from "@/lib/site-images";

export function PromoBanner() {
  return (
    <section className="relative my-8 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${SITE_IMAGES.promo}')`,
        }}
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl font-semibold text-white sm:text-4xl">
          Book Early For Festival Season
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-gray-200">
          Popular outfits get booked fast. Reserve your festive wear today and
          celebrate in style.
        </p>
        <Link
          href="/clothes"
          className="mt-8 inline-block rounded-full bg-white px-8 py-3 text-sm font-medium uppercase tracking-widest text-accent transition hover:bg-gray-100"
        >
          Browse Collection
        </Link>
      </div>
    </section>
  );
}
