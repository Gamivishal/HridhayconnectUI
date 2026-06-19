import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { fetchHomepageSectionsFromApi, HomeSection } from "../api/productService";
import { SectionCarousel } from "./SectionCarousel";
import { SectionGrid } from "./SectionGrid";

export function DynamicSectionWrapper({ componentId, layout = 'carousel' }: { componentId: number, layout?: 'carousel' | 'grid' }) {
  const [section, setSection] = useState<HomeSection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const sections = await fetchHomepageSectionsFromApi();
        if (isMounted) {
          const found = sections.find(s => s.componentId === componentId);
          if (found) setSection(found);
          setIsLoading(false);
        }
      } catch (e) {
        if (isMounted) setIsLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [componentId]);

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center items-center text-[var(--color-primary)]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }
  
  if (!section) return null;

  if (layout === 'grid') {
    return <SectionGrid section={section} />;
  }

  return <SectionCarousel section={section} />;
}

export function TopCategories() { return <DynamicSectionWrapper componentId={2} />; }
export function TrendingProducts() { return <DynamicSectionWrapper componentId={3} layout="grid" />; }
export function NewArrivals() { return <DynamicSectionWrapper componentId={4} />; }
export function FeaturedProducts() { return <DynamicSectionWrapper componentId={5} layout="grid" />; }
export function BestSellers() { return <DynamicSectionWrapper componentId={6} />; }
export function OnSaleProducts() { return <DynamicSectionWrapper componentId={7} layout="grid" />; }
