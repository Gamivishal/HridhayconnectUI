import React, { useState } from "react";
import { ShoppingBag, Heart, ChevronRight } from "lucide-react";
import { HomeSection } from "../api/productService";
import { Product } from "../data/products";
import { useCart } from "../context/CartContext";

export function SectionCarousel({ section }: { section: HomeSection }) {
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState<string[]>([]);

  const toggleWishlist = (id: string) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]
    );
  };
  const isInWishlist = (id: string) => wishlist.includes(id);

  const items = section.items;
  const isCategorySection = section.refType.toLowerCase() === 'category';

  return (
    <section className="px-4 sm:px-6 md:px-12 max-w-[1600px] mx-auto w-full py-12 md:py-16">
      <div className="relative flex items-center justify-center mb-8 md:mb-14">
        <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-dark-text)] text-center tracking-wide">
          {section.title}
        </h2>
      </div>

      <div className="relative group/carousel">
        <div className="py-4 sm:py-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-8">
            {items.map((item, idx) => {
              if (isCategorySection) {
                return (
                  <div
                    key={idx}
                    className="cursor-pointer group"
                    onClick={() => window.location.hash = `#${item.id}`}
                  >
                    <div className="rounded-[2rem] overflow-hidden aspect-[4/5] mb-4 relative shadow-md hover:shadow-2xl transition-all duration-700 transform group-hover:-translate-y-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10 opacity-70 group-hover:opacity-90 transition-opacity duration-700 z-10" />

                      {/* Inner border effect */}
                      <div className="absolute inset-4 border border-white/20 rounded-[1.5rem] z-20 scale-95 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-700" />

                      <div className="absolute inset-0 z-30 flex flex-col items-center justify-end p-8 text-center">
                        <h3 className="text-white font-serif text-2xl md:text-3xl lg:text-4xl tracking-widest uppercase font-light drop-shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                          {item.name}
                        </h3>
                        <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-100">
                          <span className="text-[var(--color-accent)] text-sm uppercase tracking-widest font-semibold">Explore Collection</span>
                          <ChevronRight className="w-4 h-4 text-[var(--color-accent)]" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else {
                const product = item as Product;
                return (
                  <div
                    key={product.id}
                    className="group cursor-pointer"
                    onClick={() => window.location.hash = `#product-${product.id}`}
                  >
                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[var(--color-primary)]/10 transition-all duration-700 relative aspect-[4/5] mb-5">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Floating Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2 items-start z-[60]">
                        {/* 
                        // NOTE: To re-add the product tag (e.g. "Deep Purifying" or "Bestseller") in the future, uncomment this block:
                        {product.tag && (
                          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[0.6rem] font-bold uppercase tracking-wider text-[var(--color-primary)] shadow-sm">
                            {product.tag}
                          </div>
                        )}
                        */}
                        {(() => {
                          const dp = typeof product.discountPercent === 'number' ? product.discountPercent : 0;
                          const sp = typeof product.sellPrice === 'number' ? product.sellPrice : product.price;
                          const op = typeof product.originalPrice === 'number' ? product.originalPrice : product.price;
                          if (dp > 0 && sp !== op) {
                            return (
                              <div className="bg-[var(--color-primary)] text-white px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider shadow-sm">
                                {Math.round(dp)}% OFF
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>

                      {/* Wishlist Toggle Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(String(product.id));
                        }}
                        className="absolute top-4 right-4 z-[60] p-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm hover:bg-white hover:scale-110 transition-all duration-300 group/wishlist"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors duration-300 ${isInWishlist(String(product.id))
                              ? 'fill-[var(--color-primary)] text-[var(--color-primary)]'
                              : 'text-[var(--color-dark-text)]/60 group-hover/wishlist:text-[var(--color-primary)]'
                            }`}
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product, 1, product.category === 'mukhwas' ? 'Pouch' : undefined);
                        }}
                        className="absolute bottom-5 right-5 bg-white/95 backdrop-blur-md p-3.5 rounded-full shadow-xl opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-500 hover:bg-[var(--color-primary)] hover:text-white text-[var(--color-dark-text)]"
                      >
                        <ShoppingBag className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="px-1 text-center md:text-left">
                      <h3 className="font-serif text-lg md:text-xl text-[var(--color-dark-text)] group-hover:text-[var(--color-primary)] transition-colors truncate">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                        <span className="text-[var(--color-primary)] font-semibold text-lg">
                          ₹{typeof product.sellPrice === 'object' ? (product.price || 0) : (product.sellPrice ?? product.price)}
                        </span>
                        {(product.originalPrice ?? product.price) !== (product.sellPrice ?? product.price) && (
                          <span className="text-sm text-[var(--color-dark-text)]/40 line-through">
                            ₹{typeof product.originalPrice === 'object' ? (product.price || 0) : product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
