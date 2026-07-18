import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { deleteClothAction, getAdminClothes } from "@/actions/admin";

async function deleteCloth(id: number) {
  "use server";
  await deleteClothAction(id);
}
import { Pencil, Plus, Trash2 } from "lucide-react";

export default async function AdminClothesPage() {
  const clothes = await getAdminClothes();

  return (
    <div className="flex">
      <AdminNav current="/admin/clothes" />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-semibold">Clothes</h1>
            <p className="mt-1 text-sm text-muted">{clothes.length} outfits</p>
          </div>
          <Link
            href="/admin/clothes/new"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-white"
          >
            <Plus className="h-4 w-4" />
            Add Outfit
          </Link>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Category</th>
                <th className="pb-3 pr-4">Price</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clothes.map((cloth) => (
                <tr key={cloth.id} className="border-b border-border">
                  <td className="py-3 pr-4 font-medium">{cloth.name}</td>
                  <td className="py-3 pr-4 text-muted">
                    {[cloth.festival, cloth.category].filter(Boolean).join(" · ") || "—"}
                  </td>
                  <td className="py-3 pr-4">₹{cloth.price}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        cloth.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {cloth.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/clothes/${cloth.id}/edit`}
                        className="rounded p-1 text-muted hover:bg-gray-100 hover:text-accent"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <form action={deleteCloth.bind(null, cloth.id)}>
                        <button
                          type="submit"
                          className="rounded p-1 text-muted hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
