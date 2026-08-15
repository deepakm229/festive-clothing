import Link from "next/link";
import {
  CLOTH_CATEGORIES,
  CATEGORY_SLUGS,
} from "@/lib/constants/categories";

export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="mb-8 text-sm text-muted" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-accent">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function AudiencePicker() {
  return (
    <div className="mb-10">
      <h2 className="text-xs font-medium uppercase tracking-widest text-muted">
        Category
      </h2>
      <div className="mt-3 flex flex-wrap gap-3">
        {CLOTH_CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/clothes/${CATEGORY_SLUGS[cat]}`}
            className="rounded-full border border-border px-5 py-2 text-sm font-medium uppercase tracking-wider hover:border-accent hover:text-accent"
          >
            {cat}
          </Link>
        ))}
      </div>
    </div>
  );
}
