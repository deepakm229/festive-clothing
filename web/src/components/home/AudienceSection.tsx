import Image from "next/image";
import Link from "next/link";
import {
  CLOTH_CATEGORIES,
  CATEGORY_SLUGS,
  type ClothCategory,
} from "@/lib/constants/categories";

type AudienceSectionProps = {
  categoryMen: string;
  categoryWomen: string;
  categoryKids: string;
};

const AUDIENCE_LABELS: Record<ClothCategory, string> = {
  Men: "Men",
  Women: "Women",
  Kids: "Kids",
};

const AUDIENCE_SUBTITLES: Record<ClothCategory, string> = {
  Men: "Kurtas, sherwanis & more",
  Women: "Lehengas, sarees & more",
  Kids: "Festive wear for little ones",
};

export function AudienceSection({
  categoryMen,
  categoryWomen,
  categoryKids,
}: AudienceSectionProps) {
  const images: Record<ClothCategory, string> = {
    Men: categoryMen,
    Women: categoryWomen,
    Kids: categoryKids,
  };

  const audiences = CLOTH_CATEGORIES.map((cat) => ({
    category: cat,
    label: AUDIENCE_LABELS[cat],
    subtitle: AUDIENCE_SUBTITLES[cat],
    image: images[cat],
    href: `/clothes/${CATEGORY_SLUGS[cat]}`,
  }));

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-3xl font-semibold text-accent">
          Category
        </h2>
        <Link
          href="/clothes"
          className="text-sm font-medium uppercase tracking-widest text-muted hover:text-accent"
        >
          View All
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {audiences.map((item) => (
          <Link
            key={item.category}
            href={item.href}
            className="group overflow-hidden rounded-xl border border-border bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:border-accent/20 hover:shadow-xl"
          >
            <div className="relative aspect-[3/3] overflow-hidden bg-gray-100">
              <Image
                src={item.image}
                alt={item.label}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="border-t border-border px-4 py-4">
              <h3 className="text-center text-lg font-medium uppercase tracking-widest">
                {item.label}
              </h3>
              <p className="mt-1 text-center text-base text-muted">{item.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
