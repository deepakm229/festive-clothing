import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/booking/BookingForm";
import { getClothById } from "@/lib/data/clothes";

type SearchParams = Promise<{
  clothId?: string;
  from?: string;
  to?: string;
}>;

export default async function BookingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const clothId = Number(params.clothId);

  if (!clothId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-semibold">Book an Outfit</h1>
        <p className="mt-4 text-muted">
          Please select an outfit first to start your booking.
        </p>
        <Link
          href="/clothes"
          className="mt-8 inline-block rounded-full bg-accent px-8 py-3 text-sm font-medium uppercase tracking-widest text-white"
        >
          Browse Collection
        </Link>
      </div>
    );
  }

  const cloth = await getClothById(clothId);
  if (!cloth) notFound();

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold text-accent">
        Book Your Outfit
      </h1>
      <p className="mt-2 text-sm text-muted">
        Fill in your details and we&apos;ll confirm your rental request.
      </p>
      <div className="mt-8">
        <BookingForm
          cloth={cloth}
          defaultFrom={params.from}
          defaultTo={params.to}
        />
      </div>
    </div>
  );
}
