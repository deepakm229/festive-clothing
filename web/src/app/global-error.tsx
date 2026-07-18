"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
        <h2 className="font-serif text-2xl font-semibold text-accent">
          Something went wrong
        </h2>
        <p className="mt-2 max-w-md text-sm text-muted">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-full bg-accent px-8 py-3 text-sm font-medium uppercase tracking-widest text-white"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
