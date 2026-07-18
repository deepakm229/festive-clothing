import { CategorySection } from "@/components/home/CategorySection";
import { Hero } from "@/components/home/Hero";
import { PromoBanner } from "@/components/home/PromoBanner";
import { TrustBar } from "@/components/home/TrustBar";
import { ClothesGrid } from "@/components/clothes/ClothesGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Cloth } from "@/lib/types";
import { getFeaturedClothes } from "@/lib/data/clothes";

export default async function HomePage() {
  let featured: Cloth[] = [];
  try {
    featured = await getFeaturedClothes(4);
  } catch {
    featured = [];
  }

  return (
    <>
      <Hero />
      <TrustBar />
      <CategorySection />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader title="Featured Outfits" href="/clothes" />
        <div className="mt-8">
          <ClothesGrid clothes={featured} />
        </div>
      </section>

      <PromoBanner />
    </>
  );
}
