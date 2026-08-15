import { notFound } from "next/navigation";
import { ClothesFilters } from "@/components/clothes/ClothesFilters";
import { ClothesGrid } from "@/components/clothes/ClothesGrid";
import { Breadcrumbs } from "@/components/clothes/BrowseNav";
import { slugToCategory, slugToSubcategory } from "@/lib/constants/categories";
import type { Cloth } from "@/lib/types";
import {
  getClothes,
  getFilterOptions,
  getSubcategoriesForCategory,
} from "@/lib/data/clothes";

export default async function SubcategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; subcategory: string }>;
  searchParams: Promise<{
    search?: string;
    festival?: string;
    size?: string;
  }>;
}) {
  const { slug, subcategory: subcategorySlug } = await params;
  const query = await searchParams;

  const category = slugToCategory(slug);
  if (!category) notFound();

  let subcategoryCandidates: string[] = [];
  try {
    subcategoryCandidates = await getSubcategoriesForCategory(category);
  } catch {
    notFound();
  }

  const subcategory = slugToSubcategory(subcategorySlug, subcategoryCandidates);
  if (!subcategory) notFound();

  const filters = {
    category,
    subcategory,
    search: query.search,
    festival: query.festival,
    size: query.size,
  };

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
      getFilterOptions(category),
    ]);
  } catch {
    clothes = [];
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: category, href: `/clothes/${slug}` },
          { label: subcategory },
        ]}
      />

      <h1 className="font-serif text-4xl font-semibold text-accent">
        {category} · {subcategory}
      </h1>
      <p className="mt-2 text-muted">
        {clothes.length} outfit{clothes.length !== 1 ? "s" : ""} available
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside>
          <ClothesFilters
            options={options}
            current={{ ...filters, category, subcategory }}
          />
        </aside>
        <div>
          <ClothesGrid clothes={clothes} />
        </div>
      </div>
    </div>
  );
}
