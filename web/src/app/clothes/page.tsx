import { ClothesFilters } from "@/components/clothes/ClothesFilters";
import { ClothesGrid } from "@/components/clothes/ClothesGrid";
import { AudiencePicker } from "@/components/clothes/BrowseNav";
import type { Cloth } from "@/lib/types";
import { getClothes, getFilterOptions } from "@/lib/data/clothes";

type SearchParams = Promise<{
  search?: string;
  category?: string;
  subcategory?: string;
  festival?: string;
  size?: string;
}>;

export default async function ClothesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = {
    search: params.search,
    category: params.category,
    subcategory: params.subcategory,
    festival: params.festival,
    size: params.size,
  };

  const hasFilters = Boolean(
    filters.search ||
      filters.category ||
      filters.subcategory ||
      filters.festival ||
      filters.size,
  );

  let clothes: Cloth[] = [];
  let options = {
    categories: [] as string[],
    subcategories: [] as string[],
    festivals: [] as string[],
    sizes: [] as string[],
  };

  try {
    [clothes, options] = await Promise.all([
      getClothes(filters),
      getFilterOptions(filters.category),
    ]);
  } catch {
    clothes = [];
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-semibold text-accent">
        Browse Collection
      </h1>
      <p className="mt-2 text-muted">
        Find the perfect festive outfit for your celebration.
      </p>

      {!hasFilters && <AudiencePicker />}

      <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside>
          <ClothesFilters options={options} current={filters} />
        </aside>
        <div>
          <p className="mb-6 text-sm text-muted">
            {clothes.length} outfit{clothes.length !== 1 ? "s" : ""} found
          </p>
          <ClothesGrid clothes={clothes} />
        </div>
      </div>
    </div>
  );
}
