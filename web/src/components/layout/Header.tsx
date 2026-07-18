import Link from "next/link";
import { Search, User } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-serif text-2xl font-semibold tracking-tight text-accent"
        >
          Festive Clothing
        </Link>

        <form action="/clothes" className="hidden flex-1 items-center md:flex">
          <div className="flex w-full max-w-xl items-center rounded-full border border-border bg-gray-50 px-4 py-2">
            <Search className="h-4 w-4 text-muted" />
            <input
              name="search"
              type="search"
              placeholder="Search festive wear..."
              className="ml-2 w-full bg-transparent text-sm outline-none placeholder:text-muted"
            />
          </div>
        </form>

        <nav className="ml-auto flex items-center gap-6 text-xs font-medium uppercase tracking-widest text-foreground">
          <Link href="/" className="hover:text-muted">
            Home
          </Link>
          <Link href="/clothes" className="hover:text-muted">
            Browse
          </Link>
          <Link
            href="/admin/login"
            className="flex items-center gap-1 hover:text-muted"
            aria-label="Admin login"
          >
            <User className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
