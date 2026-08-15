import Image from "next/image";
import Link from "next/link";
import { subcategoryToSlug } from "@/lib/constants/categories";

type SubcategoryCard = {
  name: string;
  href: string;
  image?: string;
};

type SubcategoryGridProps = {
  title: string;
  subtitle?: string;
  items: SubcategoryCard[];
  viewAllHref?: string;
  viewAllLabel?: string;
};

export function SubcategoryGrid({
  title,
  subtitle,
  items,
  viewAllHref,
  viewAllLabel,
}: SubcategoryGridProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl font-semibold text-accent">
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
        </div>
        {viewAllHref && viewAllLabel && (
          <Link
            href={viewAllHref}
            className="text-sm font-medium uppercase tracking-widest text-muted hover:text-accent"
          >
            {viewAllLabel}
          </Link>
        )}
      </div>

      {items.length === 0 ? (
        <p className="mt-12 text-center text-muted">
          No styles available yet. Check back soon.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link key={item.name} href={item.href} className="group">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-gray-100">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gray-200">
                    <span className="font-serif text-2xl text-gray-400">
                      {item.name}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="mt-3 text-center text-sm font-medium uppercase tracking-widest">
                {item.name}
              </h3>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export function buildSubcategoryCards(
  categorySlug: string,
  cards: { name: string; image?: string }[],
): SubcategoryCard[] {
  return cards.map(({ name, image }) => ({
    name,
    href: `/clothes/${categorySlug}/${subcategoryToSlug(name)}`,
    image,
  }));
}
