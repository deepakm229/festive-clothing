"use client";

import { useState, useTransition } from "react";
import { checkAvailabilityAction } from "@/actions/booking";
import Link from "next/link";
import { Calendar, CheckCircle, XCircle } from "lucide-react";

export function AvailabilityChecker({ clothId }: { clothId: number }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [result, setResult] = useState<{
    available: boolean;
    error?: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCheck() {
    startTransition(async () => {
      const res = await checkAvailabilityAction(clothId, from, to);
      setResult(res);
    });
  }

  return (
    <div className="rounded-lg border border-border bg-gray-50 p-6">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-accent" />
        <h3 className="text-sm font-semibold uppercase tracking-wider">
          Check Availability
        </h3>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs text-muted">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-muted">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleCheck}
        disabled={isPending || !from || !to}
        className="mt-4 w-full rounded-full bg-accent px-4 py-2.5 text-xs font-medium uppercase tracking-widest text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {isPending ? "Checking..." : "Check Dates"}
      </button>

      {result && (
        <div
          className={`mt-4 flex items-center gap-2 rounded-md p-3 text-sm ${
            result.error
              ? "bg-red-50 text-red-700"
              : result.available
                ? "bg-green-50 text-green-700"
                : "bg-amber-50 text-amber-700"
          }`}
        >
          {result.error ? (
            <XCircle className="h-4 w-4 shrink-0" />
          ) : result.available ? (
            <CheckCircle className="h-4 w-4 shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 shrink-0" />
          )}
          <span>
            {result.error ??
              (result.available
                ? "Available for these dates!"
                : "Not available for these dates.")}
          </span>
        </div>
      )}

      {result?.available && !result.error && (
        <Link
          href={`/booking?clothId=${clothId}&from=${from}&to=${to}`}
          className="mt-4 block w-full rounded-full border border-accent px-4 py-2.5 text-center text-xs font-medium uppercase tracking-widest text-accent hover:bg-accent hover:text-white"
        >
          Book Now
        </Link>
      )}
    </div>
  );
}
