import Link from "next/link";

type FilterOptions = {
  categories: string[];
  festivals: string[];
  sizes: string[];
};

type Props = {
  options: FilterOptions;
  current: {
    search?: string;
    category?: string;
    festival?: string;
    size?: string;
  };
};

export function ClothesFilters({ options, current }: Props) {
  return (
    <form action="/clothes" method="get" className="space-y-4 rounded-lg border border-border bg-gray-50 p-5">
      <div>
        <label className="text-xs font-medium uppercase tracking-wider text-muted">
          Search
        </label>
        <input
          name="search"
          defaultValue={current.search ?? ""}
          placeholder="Search by name..."
          className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="text-xs font-medium uppercase tracking-wider text-muted">
          Category
        </label>
        <select
          name="category"
          defaultValue={current.category ?? ""}
          className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none"
        >
          <option value="">All categories</option>
          {options.categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium uppercase tracking-wider text-muted">
          Festival
        </label>
        <select
          name="festival"
          defaultValue={current.festival ?? ""}
          className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none"
        >
          <option value="">All festivals</option>
          {options.festivals.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium uppercase tracking-wider text-muted">
          Size
        </label>
        <select
          name="size"
          defaultValue={current.size ?? ""}
          className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none"
        >
          <option value="">All sizes</option>
          {options.sizes.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex-1 rounded-full bg-accent px-4 py-2 text-xs font-medium uppercase tracking-widest text-white hover:bg-gray-800"
        >
          Apply
        </button>
        <Link
          href="/clothes"
          className="rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-widest text-muted hover:text-accent"
        >
          Clear
        </Link>
      </div>
    </form>
  );
}
