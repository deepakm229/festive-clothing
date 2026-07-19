import Image from "next/image";
import Link from "next/link";
import type { SiteImages } from "@/lib/data/site-assets";

type CategorySectionProps = Pick<
  SiteImages,
  "categoryKurta" | "categoryLehenga" | "categoryFestive"
>;

export function CategorySection({
  categoryKurta,
  categoryLehenga,
  categoryFestive,
}: CategorySectionProps) {
  const categories = [
    {
      name: "Kurta",
      festival: "Diwali",
      image: categoryKurta,
      href: "/clothes?category=Kurta",
    },
    {
      name: "Lehenga",
      festival: "Navratri",
      image: categoryLehenga,
      href: "/clothes?category=Lehenga",
    },
    {
      name: "Festive Wear",
      festival: "All Festivals",
      image: categoryFestive,
      href: "/clothes",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-3xl font-semibold text-accent">
          Categories
        </h2>
        <Link
          href="/clothes"
          className="text-sm font-medium uppercase tracking-widest text-muted hover:text-accent"
        >
          View All
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {categories.map((cat) => (
          <Link key={cat.name} href={cat.href} className="group">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <h3 className="mt-3 text-center text-sm font-medium uppercase tracking-widest">
              {cat.name}
            </h3>
            <p className="text-center text-xs text-muted">{cat.festival}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
