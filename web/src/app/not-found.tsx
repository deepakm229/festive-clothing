import Link from "next/link";
import { notFound } from "next/navigation";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="font-serif text-4xl font-semibold">404</h1>
      <p className="mt-4 text-muted">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-accent px-8 py-3 text-sm font-medium uppercase tracking-widest text-white"
      >
        Go Home
      </Link>
    </div>
  );
}
