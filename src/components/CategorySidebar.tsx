import React, { useState, useEffect } from "react";
import { fetchHomepageSectionsFromApi, HomeSection } from "../api/productService";
import { Product } from "../data/products";
import { Loader2 } from "lucide-react";

export function CategorySidebar() {
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
