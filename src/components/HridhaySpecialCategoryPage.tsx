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
          className="w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-[2.2s] ease-out brightness-95 group-hover:brightness-[1.02]"
        />
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
            className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] backdrop-blur-md text-white px-8 py-3.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300 flex items-center gap-2 shadow-lg cursor-pointer"
          >
            {cartState[product.id] ? (
              <>
                <Check className="w-3.5 h-3.5 animate-bounce" />
                <span>Added to Ritual</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Ritual</span>
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

  return (
    <div ref={pageRef} className="relative w-full bg-[var(--color-cream)] text-[var(--color-dark-text)] overflow-hidden font-sans">
      <InnerPageBanner
        eyebrow="Reserve Collection"
        title={categoryName}
        titleAccent=""
        subtitle="Premium micro-batch botanical skincare — crystal-charged, slow-stirred actives."
        breadcrumbs={[{ label: "Home", href: "#" }, { label: categoryName }]}
        bgImage="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop"
        decorativeEmoji="✨"
      />

      <section id="products-grid" className="py-16 md:py-24 px-2 sm:px-4 md:px-12 max-w-[1600px] mx-auto z-20 relative border-t border-[var(--color-primary)]/5">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-1/4 xl:w-1/5">
            <CategorySidebar />
          </div>

          <div className="w-full lg:w-3/4 xl:w-4/5">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
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
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 text-[var(--color-primary)]">
                <Sparkle className="w-10 h-10 animate-spin mb-4" />
                <span className="text-xs uppercase tracking-[0.2em] font-medium font-general">Retrieving apothecary items...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {specialsList.map((product, index) => (
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
