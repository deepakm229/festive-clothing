import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AvailabilityChecker } from "@/components/clothes/AvailabilityChecker";
import { Breadcrumbs } from "@/components/clothes/BrowseNav";
import {
  buildSubcategoryCards,
  SubcategoryGrid,
} from "@/components/clothes/SubcategoryGrid";
import { getCategorySubcategoryImageUrl, getClothImageUrl } from "@/lib/images";
import {
  formatClothMeta,
  isNumericSlug,
  slugToCategory,
  subcategoryToSlug,
} from "@/lib/constants/categories";
import { getClothById, getSubcategoryCardsForCategory } from "@/lib/data/clothes";
import { getSiteImages } from "@/lib/data/site-assets";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

async function ClothDetail({ id }: { id: number }) {
  const cloth = await getClothById(id);
  if (!cloth) notFound();

  const imageSrc = getClothImageUrl(cloth.image_url);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          ...(cloth.category
            ? [
                {
                  label: cloth.category,
                  href: `/clothes/${String(cloth.category).toLowerCase()}`,
                },
              ]
            : []),
          ...(cloth.subcategory && cloth.category
            ? [
                {
                  label: cloth.subcategory,
                  href: `/clothes/${String(cloth.category).toLowerCase()}/${subcategoryToSlug(cloth.subcategory)}`,
                },
              ]
            : []),
          { label: cloth.name },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={imageSrc}
            alt={cloth.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
            {formatClothMeta(cloth)}
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-accent">
            {cloth.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-semibold">
              {formatPrice(cloth.price)}
            </span>
            <span className="text-sm text-muted">per day</span>
          </div>

          {cloth.security_deposit > 0 && (
            <p className="mt-2 text-sm text-muted">
              Security deposit: {formatPrice(cloth.security_deposit)}
            </p>
          )}

          {cloth.size && (
            <p className="mt-4 text-sm">
              <span className="font-medium">Size:</span> {cloth.size}
            </p>
          )}

          {cloth.description && (
            <p className="mt-6 leading-relaxed text-muted">{cloth.description}</p>
          )}

          <div className="mt-8">
            <AvailabilityChecker clothId={cloth.id} />
          </div>

          <Link
            href={`/booking?clothId=${cloth.id}`}
            className="mt-4 inline-block text-sm font-medium uppercase tracking-widest text-muted hover:text-accent"
          >
            Or book without checking dates →
          </Link>
        </div>
      </div>
    </div>
  );
}

async function CategoryLanding({ slug }: { slug: string }) {
  const category = slugToCategory(slug);
  if (!category) notFound();

  const siteImages = await getSiteImages();

  let subcategoryCards: { name: string; image?: string }[] = [];
  try {
    const cards = await getSubcategoryCardsForCategory(category);
    subcategoryCards = cards.map((card) => ({
      name: card.name,
      image: getCategorySubcategoryImageUrl(
        card.name,
        siteImages,
        card.imageUrl,
      ),
    }));
  } catch {
    subcategoryCards = [];
  }

  const items = buildSubcategoryCards(slug, subcategoryCards);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: category },
        ]}
      />
      <SubcategoryGrid
        title={category}
        subtitle={`Browse festive styles for ${category.toLowerCase()}`}
        items={items}
        viewAllHref={`/clothes?category=${encodeURIComponent(category)}`}
        viewAllLabel="View all"
      />
    </>
  );
}

export default async function ClothesSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (isNumericSlug(slug)) {
    return <ClothDetail id={Number(slug)} />;
  }

  return <CategoryLanding slug={slug} />;
}
