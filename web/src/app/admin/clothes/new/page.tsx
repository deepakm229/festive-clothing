import { AdminNav } from "@/components/admin/AdminNav";
import { ClothForm } from "@/components/admin/ClothForm";

export default function NewClothPage() {
  return (
    <div className="flex">
      <AdminNav current="/admin/clothes" />
      <div className="flex-1 p-8">
        <h1 className="font-serif text-3xl font-semibold">Add Outfit</h1>
        <div className="mt-8 max-w-xl">
          <ClothForm />
        </div>
      </div>
    </div>
  );
}
