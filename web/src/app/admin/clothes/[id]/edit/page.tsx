import { notFound } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { ClothForm } from "@/components/admin/ClothForm";
import { getAdminClothById } from "@/actions/admin";

export default async function EditClothPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cloth = await getAdminClothById(Number(id));

  if (!cloth) notFound();

  return (
    <div className="flex">
      <AdminNav current="/admin/clothes" />
      <div className="flex-1 p-8">
        <h1 className="font-serif text-3xl font-semibold">Edit Outfit</h1>
        <div className="mt-8 max-w-xl">
          <ClothForm cloth={cloth} />
        </div>
      </div>
    </div>
  );
}
