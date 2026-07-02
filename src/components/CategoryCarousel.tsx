import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { ShoppingBag, Loader2, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchProductsFromApi } from "../api/productService";
import { Product } from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

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
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [itemsPerView, setItemsPerView] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimation();

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

    const handleResize = () => {
      if (window.innerWidth >= 1280) setItemsPerView(4);
      else if (window.innerWidth >= 1024) setItemsPerView(4);
      else if (window.innerWidth >= 768) setItemsPerView(3);
      else setItemsPerView(2);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const filteredProducts = activeTab === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === activeTab);

  const N = filteredProducts.length;

  useEffect(() => {
    if (N > 0) {
      setCurrentIndex(N * 2);
      controls.set({ x: `-${N * 2 * (100 / itemsPerView)}%` });
    }
  }, [activeTab, N, itemsPerView, controls]);

  useEffect(() => {
    if (isHovered || isDragging || N === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => prev + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, [isHovered, isDragging, N]);

  useEffect(() => {
    if (N === 0) return;
    const slide = async () => {
      await controls.start({
        x: `-${currentIndex * (100 / itemsPerView)}%`,
        transition: { type: "tween", ease: "easeInOut", duration: 0.6 }
      });

      if (currentIndex >= N * 3) {
        controls.set({ x: `-${N * 2 * (100 / itemsPerView)}%` });
        setCurrentIndex(N * 2);
      } else if (currentIndex <= N) {
        controls.set({ x: `-${N * 2 * (100 / itemsPerView)}%` });
        setCurrentIndex(N * 2);
      }
    };
    slide();
  }, [currentIndex, N, itemsPerView, controls]);

  const extendedProducts = N > 0 
    ? [...filteredProducts, ...filteredProducts, ...filteredProducts, ...filteredProducts, ...filteredProducts]
    : [];

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

      {/* Product Carousel */}
      <div 
        className="relative group/carousel"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
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
          <div className="overflow-hidden py-4 -mx-2 sm:-mx-3">
            <motion.div
              className="flex w-full cursor-grab active:cursor-grabbing"
              animate={controls}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={(e, { offset }) => {
                setIsDragging(false);
                const swipeThreshold = 50;
                if (offset.x < -swipeThreshold) {
                  setCurrentIndex(prev => prev + 1);
                } else if (offset.x > swipeThreshold) {
                  setCurrentIndex(prev => prev - 1);
                } else {
                  controls.start({
                    x: `-${currentIndex * (100 / itemsPerView)}%`,
                    transition: { type: "tween", ease: "easeInOut", duration: 0.3 }
                  });
                }
              }}
            >
              {extendedProducts.map((product, idx) => (
                <div
                  key={`${product.id}-${idx}`}
                  className="shrink-0 px-2 sm:px-3 group cursor-pointer"
                  style={{ width: `${100 / itemsPerView}%` }}
                  onClick={() => {
                    if (!isDragging) {
                      window.location.hash = `#product-${product.id}`;
                    }
                  }}
                >
                  <div className="bg-[var(--color-beige)]/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[var(--color-primary)]/10 transition-all duration-700 relative aspect-square mb-5">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 ${product.images[1] ? 'group-hover:opacity-0' : ''}`}
                    />
                    {product.images[1] && (
                      <img
                        src={product.images[1]}
                        alt={`${product.name} alternate`}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Floating Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 items-start z-10 pointer-events-none">
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
                      {(!product.variants || product.variants.length <= 1) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(Number(product.productId || 0), Number(product.variants?.[0]?.varientId || product.variantId || 0));
                          }}
                          aria-label={isInWishlist(Number(product.productId || 0)) ? "Remove from wishlist" : "Add to wishlist"}
                          className="absolute top-4 right-4 z-[60] p-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm hover:bg-white hover:scale-110 transition-all duration-300 group/wishlist"
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors duration-300 ${isInWishlist(Number(product.productId || 0))
                              ? 'fill-[var(--color-primary)] text-[var(--color-primary)]'
                              : 'text-[var(--color-dark-text)]/60 group-hover/wishlist:text-[var(--color-primary)]'
                              }`}
                          />
                        </button>
                      )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, 1, product.category === 'mukhwas' ? 'Pouch' : undefined);
                      }}
                      aria-label={`Add ${product.name} to cart`}
                      className="absolute bottom-5 right-5 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-full shadow-xl opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-500 hover:bg-[var(--color-primary)] hover:text-white text-[var(--color-dark-text)]"
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
            </motion.div>
          </div>
        )}

        {/* Navigation Arrows */}
        {!isLoading && filteredProducts.length > 0 && (
          <>
            <button
              onClick={() => setCurrentIndex(prev => prev - 1)}
              aria-label="Previous slide"
              className="absolute -left-2 md:-left-6 top-[40%] -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center text-[var(--color-dark-text)] hover:text-white hover:bg-[var(--color-primary)] hover:scale-110 transition-all z-30 opacity-0 group-hover/carousel:opacity-100 -translate-x-4 group-hover/carousel:translate-x-0"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={() => setCurrentIndex(prev => prev + 1)}
              aria-label="Next slide"
              className="absolute -right-2 md:-right-6 top-[40%] -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center text-[var(--color-dark-text)] hover:text-white hover:bg-[var(--color-primary)] hover:scale-110 transition-all z-30 opacity-0 group-hover/carousel:opacity-100 translate-x-4 group-hover/carousel:translate-x-0"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
