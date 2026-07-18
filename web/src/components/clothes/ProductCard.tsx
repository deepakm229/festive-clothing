import Image from "next/image";
import Link from "next/link";
import { getClothImageUrl } from "@/lib/images";
import type { Cloth } from "@/lib/types";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ProductCard({ cloth }: { cloth: Cloth }) {
  const imageSrc = getClothImageUrl(cloth.image_url);

  return (
    <Link href={`/clothes/${cloth.id}`} className="group">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={imageSrc}
          alt={cloth.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, 25vw"
        />
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-medium text-foreground group-hover:text-muted">
          {cloth.name}
        </h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold">{formatPrice(cloth.price)}</span>
          <span className="text-xs text-muted">/ day</span>
        </div>
        {(cloth.festival || cloth.category) && (
          <p className="mt-1 text-xs text-muted">
            {[cloth.festival, cloth.category].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>
    </Link>
  );
}
