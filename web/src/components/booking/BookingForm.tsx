"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBookingAction } from "@/actions/booking";
import type { Cloth } from "@/lib/types";

type Props = {
  cloth: Cloth;
  defaultFrom?: string;
  defaultTo?: string;
};

export function BookingForm({ cloth, defaultFrom = "", defaultTo = "" }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    formData.set("clothId", String(cloth.id));

    startTransition(async () => {
      const result = await createBookingAction(formData);
      if (result.success && result.bookingId) {
        router.push(`/booking/success?id=${result.bookingId}`);
      } else {
        setError(result.error ?? "Booking failed. Please try again.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div className="rounded-lg border border-border bg-gray-50 p-4">
        <p className="text-xs uppercase tracking-wider text-muted">Booking for</p>
        <p className="mt-1 font-medium">{cloth.name}</p>
        <p className="text-sm text-muted">
          ₹{cloth.price}/day · Deposit ₹{cloth.security_deposit}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-muted">
            From *
          </label>
          <input
            name="bookingFrom"
            type="date"
            required
            defaultValue={defaultFrom}
            className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-muted">
            To *
          </label>
          <input
            name="bookingTo"
            type="date"
            required
            defaultValue={defaultTo}
            className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium uppercase tracking-wider text-muted">
          Full Name *
        </label>
        <input
          name="customerName"
          required
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-muted">
            Phone *
          </label>
          <input
            name="phone"
            type="tel"
            required
            className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-muted">
            Email *
          </label>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium uppercase tracking-wider text-muted">
          Remarks
        </label>
        <textarea
          name="remarks"
          rows={3}
          placeholder="Any special requests..."
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      {error && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-accent px-6 py-3 text-sm font-medium uppercase tracking-widest text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {isPending ? "Submitting..." : "Submit Booking Request"}
      </button>
    </form>
  );
}
