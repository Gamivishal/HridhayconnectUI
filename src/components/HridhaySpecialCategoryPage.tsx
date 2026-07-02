import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { Sparkle, Check, Heart, Plus } from "lucide-react";
import { InnerPageBanner } from "./InnerPageBanner";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { products, syncProducts } from "../data/products";
import { fetchProductsFromApi } from "../api/productService";
import { CategorySidebar } from "./CategorySidebar";

interface HridhaySpecialCardProps {
  key?: any;
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    sellPrice?: number;
    discountPercent?: number;
    images: string[];
    desc: string;
    benefits: string[];
    tag: string;
    discount: string;
    variants?: any[];
  };
  index: number;
  cartState: Record<string, boolean>;
  handleAddToCart: (id: string) => void;
}

function HridhaySpecialCard({
  product,
  index,
  cartState,
  handleAddToCart
}: HridhaySpecialCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const productRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: productRef,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const renderPrice = () => {
    if (product.variants && product.variants.length > 1) {
      const prices = product.variants.map(v => v.sellPrice ?? v.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      if (minPrice === maxPrice) return `₹${minPrice}`;
      return `₹${minPrice} - ₹${maxPrice}`;
    }
    return `₹${product.sellPrice ?? product.price}`;
  };

  const isFav = isInWishlist(Number((product as any).productId || product.id));

  return (
    <motion.a
      href={`#product-${product.id}`}
      ref={productRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group block relative cursor-pointer"
      aria-label={`View details for ${product.name}`}
    >
      <motion.div
        style={{ y: index % 2 === 1 ? (typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : y) : 0 }}
        className="w-full aspect-square bg-[var(--color-beige)]/40 rounded-[2.5rem] overflow-hidden mb-6 relative shadow-md shadow-[var(--color-dark-text)]/5 border border-white/50 group-hover:shadow-xl group-hover:shadow-[var(--color-primary)]/10 transition-shadow duration-[1.2s]"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          loading={index < 2 ? "eager" : "lazy"}
          decoding={index < 2 ? "sync" : "async"}
          {...(index === 0 ? { fetchPriority: "high" } : {})}
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-110 ${product.images?.[1] ? 'group-hover:opacity-0' : ''} brightness-95 group-hover:brightness-[1.02]`}
        />
        {product.images?.[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-text)]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="absolute top-5 left-5 flex flex-col gap-2 items-start">
          {(() => {
            const sp = product.sellPrice ?? product.price;
            const op = product.originalPrice ?? product.price;
            const dp = product.discountPercent ?? 0;
            if (sp === op) return null;
            if (dp > 0) {
              return (
                <div className="bg-[var(--color-primary)] text-white px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider z-10 shadow-sm">
                  {Math.round(dp)}% OFF
                </div>
              );
            }
            return null;
          })()}
        </div>

        {(!product.variants || product.variants.length <= 1) && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(Number((product as any).productId || product.id), Number(product.variants?.[0]?.varientId || (product as any).variantId || 0));
            }}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-sm text-[var(--color-dark-text)] hover:text-[var(--color-primary)] hover:scale-105 transition-all duration-300 z-10 cursor-pointer"
            aria-label={isFav ? `Remove ${product.name} from Wishlist` : `Add ${product.name} to Wishlist`}
          >
            <Heart className={`w-4 h-4 transition-all duration-300 ${isFav ? "fill-[var(--color-primary)] text-[var(--color-primary)] scale-110" : ""}`} />
          </button>
        )}

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart(product.id);
            }}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] backdrop-blur-md text-white px-8 py-3.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300 flex items-center gap-2 shadow-lg cursor-pointer whitespace-nowrap"
          >
            {cartState[product.id] ? (
              <>
                <Check className="w-3.5 h-3.5 animate-bounce" />
                <span>Added to Cart</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      <div className="flex flex-col pt-3 border-t border-[var(--color-dark-text)]/10">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl md:text-2xl font-serif text-[var(--color-dark-text)] group-hover:text-[var(--color-primary)] transition-colors duration-300">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 font-serif text-lg">
            <span className="text-[var(--color-primary)] font-semibold">{renderPrice()}</span>
            {(() => {
              const sp = product.sellPrice ?? product.price;
              const op = product.originalPrice ?? product.price;
              if (sp !== op) {
                return <span className="text-xs text-[var(--color-dark-text)]/40 line-through">₹{op}</span>;
              }
              return null;
            })()}
          </div>
        </div>

        <p className="text-[11.5px] text-[var(--color-dark-text)]/60 font-light font-satoshi mb-4 leading-relaxed line-clamp-2">
          {product.desc}
        </p>

        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
          {product.benefits.slice(0, 2).map((benefit, idx) => (
            <li key={idx} className="flex items-center gap-1.5 text-[9.5px] text-[var(--color-dark-text)]/50 font-satoshi font-light">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]/20" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.a>
  );
}

export function HridhaySpecialCategoryPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [specialsList, setSpecialsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("Hridhay Special");
  const [cartState, setCartState] = useState<Record<string, boolean>>({});
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Hridhay Special Reserve Skincare | Hridhay Connect";
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      try {
        setIsLoading(true);
        const fetched = await fetchProductsFromApi(0);
        if (isMounted) {
          if (fetched.length > 0 && fetched[0].categoryName) {
            setCategoryName(fetched[0].categoryName);
          }
          const targetCombos = [
            { productId: 54, variantId: 187 },
            { productId: 59, variantId: 194 },
            { productId: 65, variantId: 205 },
            { productId: 62, variantId: 197 },
            { productId: 64, variantId: 201 }
          ];

          const filteredFetched = fetched.filter(p => {
            const pid = (p as any).productId || Number(p.id);
            return targetCombos.some(c => c.productId === pid);
          }).map(p => {
            const pid = (p as any).productId || Number(p.id);
            const targetVariantIds = targetCombos.filter(c => c.productId === pid).map(c => c.variantId);
            return {
              ...p,
              variants: p.variants?.filter(v => targetVariantIds.includes(Number(v.varientId) || Number((v as any).variantId))) || []
            };
          }).filter(p => p.variants && p.variants.length > 0);

          const cardSpecials = filteredFetched.map(p => {
            const variant = p.variants?.[0];
            return {
              id: p.id,
              name: p.name,
              price: variant ? (variant.sellPrice ?? variant.price) : (p.originalPrice ?? p.price),
              sellPrice: variant ? (variant.sellPrice ?? variant.price) : (p.sellPrice ?? p.price),
              discountPercent: p.discountPercent ?? 0,
              originalPrice: variant ? variant.price : (p.originalPrice ?? p.price),
              images: p.images,
              desc: p.desc,
              benefits: p.benefits || ["Cellular healing & soothing benefits", "100% clean & chemical-free"],
              tag: p.tag || "",
              discount: p.discount,
              variants: p.variants
            };
          });
          setSpecialsList(cardSpecials);
          if (cardSpecials.length > 0) {
            const maxVal = Math.max(100, Math.ceil(Math.max(...cardSpecials.map(s => Number(s.sellPrice ?? s.price) || 0))));
            setMaxPrice(maxVal);
          }
          syncProducts(filteredFetched);
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadProducts();
    return () => { isMounted = false; };
  }, []);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  const handleAddToCart = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      addToCart(product, 1);
    }
    setCartState(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCartState(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const maxLimit = specialsList.length > 0 ? Math.max(100, Math.ceil(Math.max(...specialsList.map(s => Number(s.sellPrice ?? s.price) || 0)))) : 1000;

  const filteredSpecials = specialsList.filter(product => {
    const price = product.sellPrice ?? product.price;
    return price >= minPrice && price <= maxPrice;
  });

  return (
    <div ref={pageRef} className="relative w-full bg-[var(--color-cream)] text-[var(--color-dark-text)] overflow-hidden font-sans">
      <InnerPageBanner
        eyebrow="Reserve Collection"
        title={categoryName}
        titleAccent=""
        subtitle="Premium micro-batch botanical skincare — crystal-charged, slow-stirred actives."
        //  breadcrumbs={[{ label: "Home", href: "#" }, { label: categoryName }]}
        bgImage="/Image/Bannerimg/HridhaySpecial.webp"
        decorativeEmoji="✨"
      />

      <section id="products-grid" className="py-16 md:py-24 px-2 sm:px-4 md:px-12 max-w-[1600px] mx-auto z-20 relative border-t border-[var(--color-primary)]/5">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-1/4 xl:w-1/5">
            <CategorySidebar
              minPrice={minPrice}
              maxPrice={maxPrice}
              maxLimit={maxLimit}
              onPriceChange={(min, max) => {
                setMinPrice(min);
                setMaxPrice(max);
              }}
            />
          </div>

          <div className="w-full lg:w-3/4 xl:w-4/5">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
              <div>
                <span className="text-[var(--color-primary)] font-medium tracking-[0.2em] uppercase text-xs mb-4 flex items-center gap-4">
                  <span className="w-12 h-[1px] bg-[var(--color-primary)]"></span>
                  Ultra-Premium Skincare Grid
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-black leading-tight font-light">
                  Artisanal Apothecary <br />
                  <span className="italic text-[var(--color-secondary)]">Reserve Masterpieces</span>
                </h2>
              </div>

              {/* Top Right Price Filter */}
              <div className="flex items-center gap-4 bg-white/60 p-4 rounded-3xl border border-white/80 shadow-sm backdrop-blur-md w-full md:max-w-xs shrink-0 z-[60]">
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)]">
                    <span>Filter Price</span>
                    <span>₹{minPrice} - ₹{maxPrice}</span>
                  </div>
                  <div className="relative w-full h-4 flex items-center">
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
                        setMinPrice(val);
                      }}
                      className="absolute w-full appearance-none h-1 bg-transparent pointer-events-none focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-primary)] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--color-primary)] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer z-10"
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
                        setMaxPrice(val);
                      }}
                      className="absolute w-full appearance-none h-1 bg-transparent pointer-events-none focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-primary)] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--color-primary)] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer z-20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 text-[var(--color-primary)]">
                <Sparkle className="w-10 h-10 animate-spin mb-4" />
                <span className="text-xs uppercase tracking-[0.2em] font-medium font-general">Retrieving apothecary items...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {filteredSpecials.map((product, index) => (
                  <HridhaySpecialCard
                    key={product.id}
                    product={product}
                    index={index}
                    cartState={cartState}
                    handleAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
