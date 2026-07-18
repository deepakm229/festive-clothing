import Link from "next/link";
import { logoutAction } from "@/actions/admin";
import { Shirt, CalendarDays, LayoutDashboard } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/clothes", label: "Clothes", icon: Shirt },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
];

export function AdminNav({ current }: { current: string }) {
  return (
    <aside className="w-56 shrink-0 border-r border-border bg-gray-50 p-6">
      <p className="font-serif text-lg font-semibold">Admin</p>
      <nav className="mt-6 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
              current === href
                ? "bg-accent text-white"
                : "text-muted hover:bg-white hover:text-accent"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
      <form action={logoutAction} className="mt-8">
        <button
          type="submit"
          className="text-sm text-muted hover:text-accent"
        >
          Sign out
        </button>
      </form>
    </aside>
  );
}
