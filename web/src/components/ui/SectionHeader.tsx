import Link from "next/link";

export function SectionHeader({
  title,
  href,
  linkLabel = "View All",
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-serif text-3xl font-semibold text-accent">{title}</h2>
      {href && (
        <Link
          href={href}
          className="text-sm font-medium uppercase tracking-widest text-muted hover:text-accent"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
