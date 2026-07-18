import type { Cloth } from "@/lib/types";
import { ProductCard } from "./ProductCard";

export function ClothesGrid({ clothes }: { clothes: Cloth[] }) {
  if (clothes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-16 text-center">
        <p className="text-muted">No outfits found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
      {clothes.map((cloth) => (
        <ProductCard key={cloth.id} cloth={cloth} />
      ))}
    </div>
  );
}
