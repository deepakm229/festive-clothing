import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h1 className="mt-6 font-serif text-3xl font-semibold text-accent">
        Booking Request Submitted
      </h1>
      <p className="mt-4 text-muted">
        Thank you! Your rental request has been received
        {params.id ? ` (Reference #${params.id})` : ""}. We&apos;ll contact you
        shortly to confirm availability and pickup details.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/clothes"
          className="rounded-full bg-accent px-8 py-3 text-sm font-medium uppercase tracking-widest text-white"
        >
          Browse More
        </Link>
        <Link
          href="/"
          className="rounded-full border border-border px-8 py-3 text-sm font-medium uppercase tracking-widest text-muted"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
