import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, ShoppingBag, Loader2 } from "lucide-react";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(4);
  const { addToCart } = useCart();
  
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
      if (window.innerWidth >= 1024) setItemsPerView(4);
      else if (window.innerWidth >= 768) setItemsPerView(3);
      else if (window.innerWidth >= 640) setItemsPerView(2);
      else setItemsPerView(1);
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

  const maxIndex = Math.max(0, filteredProducts.length - itemsPerView);

  // Auto-play logic
  useEffect(() => {
    if (isHovered || filteredProducts.length <= itemsPerView) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(timer);
  }, [isHovered, filteredProducts.length, itemsPerView, maxIndex]);

  // Reset index when tab changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab]);

  const handleNext = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

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
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium tracking-[0.05em] transition-all duration-300 ${
              activeTab === cat.id
                ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30 scale-105"
                : "bg-white text-[var(--color-dark-text)] hover:bg-[var(--color-primary)]/10 hover:scale-105"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Carousel */}
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
          <div className="overflow-hidden relative px-2">
            <motion.div 
              className="flex gap-4 w-full"
              animate={{ 
                x: `calc(-${currentIndex} * (100% / ${itemsPerView} + ${16 / itemsPerView}px))` 
              }}
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
            >
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="shrink-0 group cursor-pointer"
                  style={{ width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 16 / itemsPerView}px)` }}
                  onClick={() => window.location.hash = `#product-${product.id}`}
                >
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[var(--color-primary)]/10 transition-all duration-700 relative aspect-[4/5] mb-5">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {product.tag && (
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[0.6rem] font-bold uppercase tracking-wider text-[var(--color-primary)] shadow-sm">
                        {product.tag}
                      </div>
                    )}
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
                      <span className="text-[var(--color-primary)] font-semibold text-lg">₹{product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-[var(--color-dark-text)]/40 line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        )}

        {/* Navigation Buttons */}
        {!isLoading && filteredProducts.length > itemsPerView && (
          <>
            <button 
              onClick={handlePrev}
              className="absolute -left-4 md:-left-6 top-[40%] -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center text-[var(--color-dark-text)] hover:text-white hover:bg-[var(--color-primary)] hover:scale-110 transition-all z-10 opacity-0 group-hover/carousel:opacity-100 -translate-x-4 group-hover/carousel:translate-x-0"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={handleNext}
              className="absolute -right-4 md:-right-6 top-[40%] -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center text-[var(--color-dark-text)] hover:text-white hover:bg-[var(--color-primary)] hover:scale-110 transition-all z-10 opacity-0 group-hover/carousel:opacity-100 translate-x-4 group-hover/carousel:translate-x-0"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
