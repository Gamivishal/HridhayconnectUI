import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { ShoppingBag, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { HomeSection } from "../api/productService";
import { Product } from "../data/products";
import { useCart } from "../context/CartContext";

export function SectionCarousel({ section }: { section: HomeSection }) {
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimation();

  const toggleWishlist = (id: string) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]
    );
  };
  const isInWishlist = (id: string) => wishlist.includes(id);

  const items = section.items;
  const isCategorySection = section.refType.toLowerCase() === 'category';
  const N = items.length;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) setItemsPerView(4);
      else if (window.innerWidth >= 1024) setItemsPerView(4);
      else if (window.innerWidth >= 768) setItemsPerView(3);
      else if (window.innerWidth >= 640) setItemsPerView(2);
      else setItemsPerView(1.5);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (N > 0) {
      setCurrentIndex(N * 2);
      controls.set({ x: `-${N * 2 * (100 / itemsPerView)}%` });
    }
  }, [N, itemsPerView, controls]);

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

  const extendedItems = N > 0 
    ? [...items, ...items, ...items, ...items, ...items]
    : [];

  return (
    <section className="px-4 sm:px-6 md:px-12 max-w-[1600px] mx-auto w-full py-12 md:py-16 relative z-10">
      <div className="relative flex items-center justify-center mb-8 md:mb-14">
        <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-dark-text)] text-center tracking-wide">
          {section.title}
        </h2>
      </div>

      <div 
        className="relative group/carousel"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {items.length === 0 ? (
          <div className="flex justify-center items-center h-64 text-[var(--color-dark-text)]/50 font-serif text-xl">
            No masterpieces found.
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
              {extendedItems.map((item, idx) => {
                if (isCategorySection) {
                  return (
                    <div
                      key={`cat-${item.id}-${idx}`}
                      className="shrink-0 px-2 sm:px-3"
                      style={{ width: `${100 / itemsPerView}%` }}
                      onClick={() => {
                        if (!isDragging) {
                          window.location.hash = `#${item.id}`;
                        }
                      }}
                    >
                      <div className="cursor-pointer group">
                        <div className="rounded-[2rem] overflow-hidden aspect-[4/5] mb-4 relative shadow-md hover:shadow-2xl transition-all duration-700 transform group-hover:-translate-y-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                          />
                          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-700 z-10" />

                          {/* Inner border effect */}
                          <div className="absolute inset-4 border border-white/40 rounded-[1.5rem] z-20 scale-95 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
                        </div>
                        <div className="px-2 text-center mt-2">
                          <h3 className="font-serif text-xl md:text-2xl text-[var(--color-dark-text)] group-hover:text-[var(--color-primary)] transition-colors tracking-widest uppercase font-light">
                            {item.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  const product = item as Product;
                  return (
                    <div
                      key={`prod-${product.id}-${idx}`}
                      className="shrink-0 px-2 sm:px-3"
                      style={{ width: `${100 / itemsPerView}%` }}
                      onClick={() => {
                        if (!isDragging) {
                          window.location.hash = `#product-${product.id}`;
                        }
                      }}
                    >
                      <div className="group cursor-pointer">
                        <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[var(--color-primary)]/10 transition-all duration-700 relative aspect-[4/5] mb-5">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          {/* Floating Badges */}
                          <div className="absolute top-4 left-4 flex flex-col gap-2 items-start z-20 pointer-events-none">
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
                    </div>
                  );
                }
              })}
            </motion.div>
          </div>
        )}

        {/* Navigation Arrows */}
        {items.length > 0 && (
          <>
            <button
              onClick={() => setCurrentIndex(prev => prev - 1)}
              className="absolute -left-2 md:-left-6 top-[40%] -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center text-[var(--color-dark-text)] hover:text-white hover:bg-[var(--color-primary)] hover:scale-110 transition-all z-30 opacity-0 group-hover/carousel:opacity-100 -translate-x-4 group-hover/carousel:translate-x-0"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={() => setCurrentIndex(prev => prev + 1)}
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
