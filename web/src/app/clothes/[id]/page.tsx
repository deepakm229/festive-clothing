import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AvailabilityChecker } from "@/components/clothes/AvailabilityChecker";
import { getClothImageUrl } from "@/lib/images";
import { getClothById } from "@/lib/data/clothes";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function ClothDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cloth = await getClothById(Number(id));

  if (!cloth) notFound();

  const imageSrc = getClothImageUrl(cloth.image_url);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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
            {[cloth.festival, cloth.category].filter(Boolean).join(" · ")}
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
