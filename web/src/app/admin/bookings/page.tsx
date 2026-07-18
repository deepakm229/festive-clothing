import { AdminNav } from "@/components/admin/AdminNav";
import { getAdminBookings, updateBookingStatusAction } from "@/actions/admin";

async function confirmBooking(id: number) {
  "use server";
  await updateBookingStatusAction(id, "confirmed");
}

async function cancelBooking(id: number) {
  "use server";
  await updateBookingStatusAction(id, "Cancelled");
}

export default async function AdminBookingsPage() {
  const bookings = await getAdminBookings();

  return (
    <div className="flex">
      <AdminNav current="/admin/bookings" />
      <div className="flex-1 p-8">
        <h1 className="font-serif text-3xl font-semibold">Bookings</h1>
        <p className="mt-1 text-sm text-muted">{bookings.length} total requests</p>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
                <th className="pb-3 pr-4">Customer</th>
                <th className="pb-3 pr-4">Outfit</th>
                <th className="pb-3 pr-4">Dates</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-border">
                  <td className="py-3 pr-4">
                    <p className="font-medium">{booking.customer_name}</p>
                    <p className="text-xs text-muted">{booking.phone}</p>
                    <p className="text-xs text-muted">{booking.email}</p>
                  </td>
                  <td className="py-3 pr-4">
                    {booking.clothes?.name ?? `Outfit #${booking.cloth_id}`}
                  </td>
                  <td className="py-3 pr-4 text-muted">
                    {booking.booking_from} → {booking.booking_to}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs capitalize">
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-1">
                      {booking.status !== "confirmed" && (
                        <form action={confirmBooking.bind(null, booking.id)}>
                          <button
                            type="submit"
                            className="rounded bg-green-100 px-2 py-1 text-xs text-green-700 hover:bg-green-200"
                          >
                            Confirm
                          </button>
                        </form>
                      )}
                      {booking.status !== "Cancelled" && (
                        <form action={cancelBooking.bind(null, booking.id)}>
                          <button
                            type="submit"
                            className="rounded bg-red-100 px-2 py-1 text-xs text-red-700 hover:bg-red-200"
                          >
                            Cancel
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {bookings.length === 0 && (
            <p className="mt-8 text-center text-muted">No bookings yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
