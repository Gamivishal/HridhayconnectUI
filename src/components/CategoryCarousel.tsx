import React, { useState, useEffect } from "react";
import { ShoppingBag, Loader2, Heart } from "lucide-react";
import { fetchProductsFromApi } from "../api/productService";
import { Product } from "../data/products";
import { useCart } from "../context/CartContext";

const categories = [
  { id: 'all', label: 'All' },
  { id: 'soap', label: 'Soaps' },
  { id: 'hair-oil', label: 'Hair Oil' },
  { id: 'mukhwas', label: 'Mukhwas' },
  { id: 'tea-masala', label: 'Tea Masala' },
  { id: 'hridhay-special', label: 'Hridhay Special' }
];

export function CategoryCarousel() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      try {
        // Pass 0 to fetch all categories as per { id: -2, categoryId: 0 }
        const data = await fetchProductsFromApi(0);
        if (isMounted) {
          setAllProducts(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch products for carousel", err);
        if (isMounted) setIsLoading(false);
      }
    }
    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = activeTab === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === activeTab);

  // Reset limit/index when tab changes if needed, but since it's a grid we show all
  // auto-play and resize logic removed

  const toggleWishlist = (id: string) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]
    );
  };
  const isInWishlist = (id: string) => wishlist.includes(id);

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 md:px-12 max-w-[1600px] mx-auto bg-[var(--color-cream)] relative z-10">
      <div className="text-center mb-10 md:mb-16">
        <span className="text-[var(--color-primary)] font-medium tracking-[0.2em] uppercase text-xs sm:text-sm mb-4 inline-block">
          Explore The Collection
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[var(--color-dark-text)] mb-6 leading-tight">
          Crafted with <span className="italic text-[var(--color-secondary)]">Nature</span>
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium tracking-[0.05em] transition-all duration-300 ${activeTab === cat.id
                ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30 scale-105"
                : "bg-white text-[var(--color-dark-text)] hover:bg-[var(--color-primary)]/10 hover:scale-105"
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="relative">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-64 text-[var(--color-primary)]">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <span className="text-sm uppercase tracking-widest">Loading Curations...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex justify-center items-center h-64 text-[var(--color-dark-text)]/50 font-serif text-xl">
            No masterpieces found in this category yet.
          </div>
        ) : (
          <div className="px-2">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-8">
              {filteredProducts.map((product) => (
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
                    <div className="absolute top-4 left-4 flex flex-col gap-2 items-start z-10">
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
                      className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm hover:bg-white hover:scale-110 transition-all duration-300 group/wishlist"
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
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
