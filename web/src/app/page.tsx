import { AudienceSection } from "@/components/home/AudienceSection";
import { Hero } from "@/components/home/Hero";
import { PromoBanner } from "@/components/home/PromoBanner";
import { TrustBar } from "@/components/home/TrustBar";
import { ClothesGrid } from "@/components/clothes/ClothesGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Cloth } from "@/lib/types";
import { getFeaturedClothes } from "@/lib/data/clothes";
import { getSiteImages } from "@/lib/data/site-assets";
import { getSiteImages } from "@/lib/data/site-assets";

export default async function HomePage() {
  const siteImages = await getSiteImages();

  const siteImages = await getSiteImages();

  let featured: Cloth[] = [];
  try {
    featured = await getFeaturedClothes(4);
  } catch {
    featured = [];
  }

  return (
    <>
      <Hero imageUrl={siteImages.hero} />
      <Hero imageUrl={siteImages.hero} />
      <TrustBar />
      <AudienceSection
        categoryMen={siteImages.categoryMen}
        categoryWomen={siteImages.categoryWomen}
        categoryKids={siteImages.categoryKids}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader title="Featured Outfits" href="/clothes" />
        <div className="mt-8">
          <ClothesGrid clothes={featured} emphasizedText />
        </div>
      </section>

      <PromoBanner imageUrl={siteImages.promo} />
      <PromoBanner imageUrl={siteImages.promo} />
    </>
  );
}
