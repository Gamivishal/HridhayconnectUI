import React, { useState, useEffect } from "react";
import { fetchHomepageSectionsFromApi, HomeSection } from "../api/productService";
import { Product } from "../data/products";
import { Loader2 } from "lucide-react";

interface CategorySidebarProps {
  minPrice?: number;
  maxPrice?: number;
  maxLimit?: number;
  onPriceChange?: (min: number, max: number) => void;
}

export function CategorySidebar({ minPrice = 0, maxPrice = 1000, maxLimit = 1000, onPriceChange }: CategorySidebarProps) {
  const [featuredSection, setFeaturedSection] = useState<HomeSection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentHash = typeof window !== 'undefined' ? window.location.hash : '';

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const sections = await fetchHomepageSectionsFromApi();
        if (isMounted) {
          const found = sections.find(s => s.componentId === 5); // Featured Products
          if (found) setFeaturedSection(found);
          setIsLoading(false);
        }
      } catch (e) {
        if (isMounted) setIsLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  const categories = [
    { name: "Home Made Soap", hash: "#soap" },
    { name: "Home Made Hair Oil", hash: "#hair-oil" },
    { name: "Home Made Mukhwas", hash: "#mukhwas" },
    { name: "Home Made Tea Masala", hash: "#tea-masala" },
    { name: "Hridhay Special", hash: "#hridhay-special" },
  ];

  return (
    <aside className="w-full flex flex-col gap-8 md:gap-12">
      {/* Categories Menu */}
      <div className="bg-white/60 p-6 md:p-8 rounded-[2rem] border border-white/80 shadow-[0_4px_24px_rgb(0,0,0,0.02)] backdrop-blur-md">
        <h3 className="text-xl font-serif mb-6 text-black tracking-wide border-b border-black/5 pb-4">Categories</h3>
        <ul className="space-y-4">
          {categories.map((cat, idx) => {
            const isActive = currentHash === cat.hash || currentHash === cat.hash.replace('#', '#/');
            return (
              <li key={idx}>
                <button 
                  onClick={() => {
                    window.location.hash = cat.hash;
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`text-sm tracking-wide transition-all duration-300 hover:text-[var(--color-primary)] hover:translate-x-1 text-left w-full ${isActive ? 'text-[var(--color-primary)] font-semibold translate-x-1' : 'text-[var(--color-dark-text)]/80 font-medium'}`}
                >
                  {cat.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Price Filter */}
      {onPriceChange && (
        <div className="bg-white/60 p-6 md:p-8 rounded-[2rem] border border-white/80 shadow-[0_4px_24px_rgb(0,0,0,0.02)] backdrop-blur-md">
          <h3 className="text-xl font-serif mb-6 text-black tracking-wide border-b border-black/5 pb-4">Filter by Price</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-medium text-[var(--color-dark-text)]/60 font-general">
              <span>Min: ₹{minPrice}</span>
              <span>Max: ₹{maxPrice}</span>
            </div>
            <div className="relative w-full h-6 flex items-center">
              {/* Track background */}
              <div className="absolute left-0 right-0 h-1 bg-black/5 rounded-lg pointer-events-none" />
              
              {/* Selected range highlight */}
              <div 
                className="absolute h-1 bg-[var(--color-primary)] rounded-lg pointer-events-none"
                style={{
                  left: `${maxLimit > 0 ? (minPrice / maxLimit) * 100 : 0}%`,
                  right: `${maxLimit > 0 ? 100 - (maxPrice / maxLimit) * 100 : 0}%`
                }}
              />

              {/* Min range input */}
              <input
                type="range"
                min="0"
                max={maxLimit}
                step="10"
                value={minPrice}
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), maxPrice);
                  onPriceChange(val, maxPrice);
                }}
                className="absolute w-full appearance-none h-1 bg-transparent pointer-events-none focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-primary)] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--color-primary)] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer z-10"
              />

              {/* Max range input */}
              <input
                type="range"
                min="0"
                max={maxLimit}
                step="10"
                value={maxPrice}
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), minPrice);
                  onPriceChange(minPrice, val);
                }}
                className="absolute w-full appearance-none h-1 bg-transparent pointer-events-none focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-primary)] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--color-primary)] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer z-20"
              />
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                value={minPrice || ""}
                onChange={(e) => {
                  const val = Number(e.target.value) || 0;
                  onPriceChange(val, Math.max(val, maxPrice));
                }}
                className="w-full bg-white border border-black/10 rounded-xl px-3 py-1.5 text-xs text-center focus:border-[var(--color-primary)] focus:outline-none"
              />
              <span className="text-[var(--color-dark-text)]/40">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice === maxLimit ? "" : maxPrice}
                onChange={(e) => {
                  const val = Number(e.target.value) || maxLimit;
                  onPriceChange(Math.min(minPrice, val), val);
                }}
                className="w-full bg-white border border-black/10 rounded-xl px-3 py-1.5 text-xs text-center focus:border-[var(--color-primary)] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Featured Products */}
      <div className="hidden lg:block bg-white/60 p-6 md:p-8 rounded-[2rem] border border-white/80 shadow-[0_4px_24px_rgb(0,0,0,0.02)] backdrop-blur-md">
        <h3 className="text-xl font-serif mb-6 text-black tracking-wide border-b border-black/5 pb-4">Featured Products</h3>
        
        {isLoading ? (
          <div className="flex justify-center py-8 text-[var(--color-primary)]">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : featuredSection && featuredSection.items.length > 0 ? (
          <div className="flex flex-col gap-6">
            {featuredSection.items.slice(0, 4).map((item, idx) => {
              const product = item as Product;
              return (
                <div 
                  key={product.id || idx} 
                  className="flex items-center gap-4 group cursor-pointer bg-white/40 p-2 rounded-2xl hover:bg-white transition-all duration-300"
                  onClick={() => window.location.hash = `#product-${product.id}`}
                >
                  <div className="w-20 h-24 rounded-xl overflow-hidden bg-white shrink-0 border border-neutral-100 shadow-sm relative">
                    <img 
                      src={product.images?.[0] || product.img} 
                      alt={product.name} 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="text-sm font-serif text-[var(--color-dark-text)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 leading-snug mb-1">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--color-primary)] font-semibold text-sm">
                        ₹{typeof product.sellPrice === 'object' ? (product.price || 0) : (product.sellPrice ?? product.price)}
                      </span>
                      {(product.originalPrice ?? product.price) !== (product.sellPrice ?? product.price) && (
                        <span className="text-xs text-[var(--color-dark-text)]/40 line-through">
                          ₹{typeof product.originalPrice === 'object' ? (product.price || 0) : product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-[var(--color-dark-text)]/60">No featured products found.</p>
        )}
      </div>
    </aside>
  );
}
