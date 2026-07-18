import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { getAdminBookings, getAdminClothes } from "@/actions/admin";

export default async function AdminDashboardPage() {
  let clothesCount = 0;
  let bookingsCount = 0;
  let pendingCount = 0;

  try {
    const [clothes, bookings] = await Promise.all([
      getAdminClothes(),
      getAdminBookings(),
    ]);
    clothesCount = clothes.length;
    bookingsCount = bookings.length;
    pendingCount = bookings.filter((b) => b.status === "pending").length;
  } catch {
    // Auth or connection error handled by middleware
  }

  return (
    <div className="flex">
      <AdminNav current="/admin" />
      <div className="flex-1 p-8">
        <h1 className="font-serif text-3xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-sm text-muted">Overview of your rental business.</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg border border-border p-6">
            <p className="text-xs uppercase tracking-wider text-muted">Outfits</p>
            <p className="mt-2 text-3xl font-semibold">{clothesCount}</p>
            <Link href="/admin/clothes" className="mt-2 text-sm text-muted hover:text-accent">
              Manage →
            </Link>
          </div>
          <div className="rounded-lg border border-border p-6">
            <p className="text-xs uppercase tracking-wider text-muted">Bookings</p>
            <p className="mt-2 text-3xl font-semibold">{bookingsCount}</p>
            <Link href="/admin/bookings" className="mt-2 text-sm text-muted hover:text-accent">
              View all →
            </Link>
          </div>
          <div className="rounded-lg border border-border p-6">
            <p className="text-xs uppercase tracking-wider text-muted">Pending</p>
            <p className="mt-2 text-3xl font-semibold">{pendingCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
