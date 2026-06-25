import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { Award, Heart, Leaf, Star, Sparkle, Plus, ChevronDown, Check } from "lucide-react";
import { products, syncProducts } from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { InnerPageBanner } from "./InnerPageBanner";
import { fetchProductsFromApi } from "../api/productService";

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

  return (
    <motion.div
      ref={productRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group cursor-pointer relative"
      onClick={() => {
        window.location.hash = `#product-${product.id}`;
      }}
    >
      <motion.div
        style={{ y: index % 2 === 1 ? (typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : y) : 0 }}
        className="w-full aspect-[4/5] bg-[var(--color-beige)]/40 rounded-[2.5rem] overflow-hidden mb-6 relative shadow-md shadow-[var(--color-dark-text)]/5 border border-white/50 group-hover:shadow-xl group-hover:shadow-[var(--color-primary)]/10 transition-shadow duration-[1.2s]"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain object-center group-hover:scale-[1.04] transition-transform duration-[2.2s] ease-out brightness-95 group-hover:brightness-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-text)]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Floating Badges */}
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

        {/* Wishlist Toggle Button */}
        {(!product.variants || product.variants.length <= 1) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(Number((product as any).productId || product.id), Number(product.variants?.[0]?.varientId || (product as any).variantId || 0));
            }}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-sm text-[var(--color-dark-text)] hover:text-[var(--color-primary)] hover:scale-105 transition-all duration-300 z-10 cursor-pointer"
            aria-label="Add to Wishlist"
          >
            <Heart className={`w-4 h-4 transition-all duration-300 ${isInWishlist(Number((product as any).productId || product.id)) ? "fill-[var(--color-primary)] text-[var(--color-primary)] scale-110" : ""}`} />
          </button>
        )}

        {/* Quick Add To Cart overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20">
          <button
            onClick={(e) => {
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

      {/* Details Section */}
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

        {/* Subtle benefit items list */}
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
          {product.benefits.slice(0, 2).map((benefit, idx) => (
            <li key={idx} className="flex items-center gap-1.5 text-[9.5px] text-[var(--color-dark-text)]/50 font-satoshi font-light">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]/20" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

    </motion.div>
  );
}export function HridhaySpecialCategoryPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [specialsList, setSpecialsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("Hridhay Special");

  // Scroll to top and set page title on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Hridhay Special Reserve Skincare | Hridhay Connect";
  }, []);

  // Fetch reserve products from live API (CategoryId: 19)
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
            // Use the target variant's price if available
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
              benefits: p.benefits || [
                "Cellular healing & soothing benefits",
                "100% clean & chemical-free"
              ],
              tag: p.tag || "",
              discount: p.discount,
              variants: p.variants
            };
          });
          setSpecialsList(cardSpecials);
          syncProducts(filteredFetched);
        }
      } catch (error) {
        console.error("[HridhaySpecialPage API Error] Failed to load reserve products from API:", error);
        if (isMounted) {
          const targetCombos = [
            { productId: 54, variantId: 187 },
            { productId: 59, variantId: 194 },
            { productId: 65, variantId: 205 },
            { productId: 62, variantId: 197 },
            { productId: 64, variantId: 201 }
          ];

          const filtered = products.filter(p => {
            // Usually local products have string IDs that might contain hyphens, but we try parsing
            const pidStr = p.id.replace(/-.*/, "");
            return targetCombos.some(c => c.productId.toString() === pidStr);
          });
          
          const enriched = filtered.map(spec => {
            const pidStr = spec.id.replace(/-.*/, "");
            const targetVariantIds = targetCombos.filter(c => c.productId.toString() === pidStr).map(c => c.variantId);

            const matchingProduct = products.find(p => p.id === spec.id || p.id.replace(/-100|-200/g, "") === spec.id.replace(/-100|-200/g, ""));
            const allVariants = matchingProduct?.variants || spec.variants || [];
            
            return {
              ...spec,
              variants: allVariants.filter(v => targetVariantIds.includes(Number(v.varientId) || Number((v as any).variantId)))
            };
          }).filter(p => p.variants && p.variants.length > 0);

          setSpecialsList(enriched);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadProducts();
    return () => { isMounted = false; };
  }, []);

  // Ingredients Data
  const keyIngredients = [
    {
      name: "Wild Lavender Active",
      source: "High-Altitude Provence Gardens",
      benefit: "Cellular Healing",
      desc: "Distilled under cold sterile vacuum conditions to protect active esters that speed up dermal cell recovery and calm redness.",
      img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop"
    },
    {
      name: "Kakadu Plum Active",
      source: "Northern Territory Cooperatives",
      benefit: "Vitamin C Brightening",
      desc: "The world's richest natural source of active Vitamin C, boosting natural collagen synthesis and clearing pigmentation.",
      img: "https://images.unsplash.com/photo-1629198728070-7815cf1be5e8?q=400&auto=format&fit=crop"
    },
    {
      name: "Organic Chamomile Blossom",
      source: "In-House Botanical Gardens",
      benefit: "Anti-Redness & Calming",
      desc: "Rich in active apigenin compounds that instantly soothe surface skin irritation, dryness, and environmental wind-chafing.",
      img: "https://images.unsplash.com/photo-1607006482945-aa1a1827402c?q=80&w=400&auto=format&fit=crop"
    }
  ];

  // FAQs State & Data
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqs = [
    {
      q: "What makes the 'Hridhay Special' reserve line different from normal products?",
      a: "Our Hridhay Special line represents our signature Reserve Collection. These products feature premium botanical actives (like Kakadu Plum and wild French lavender) slow-cured in small, sterile micro-batches and energetically aligned using crystals to provide the highest potency skin recovery and calming aromatherapy."
    },
    {
      q: "Are these skincare products suitable for extremely sensitive skin?",
      a: "Yes. Every formulation in our reserve line is dermatologically audited, non-comedogenic, and 100% free of synthetic colors, artificial fragrances, silicones, and parabens, making them safe for sensitive skin types."
    },
    {
      q: "How should I integrate the Amethyst Revival Serum and Lavender Sleep Mask?",
      a: "For optimal overnight cellular repair: cleanse your skin, spray the Plum Essence Toner, apply 3-4 drops of the Amethyst Revival Serum, and seal everything in with a generous layer of the Lavender Sleep Mask as the final step of your evening ritual."
    },
    {
      q: "What is the shelf life of these preservative-free formulations?",
      a: "By using biophotonic glass jars that filter out degrading visible light, we naturally preserve the active botanical shelf life for 12 months without adding synthetic parabens."
    }
  ];

  // Cart Interactions (for micro-interaction feedback)
  const [cartState, setCartState] = useState<Record<string, boolean>>({});

  const { addToCart } = useCart();

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
        subtitle="Premium micro-batch botanical skincare — crystal-charged, slow-stirred actives for overnight cellular repair and luminous skin."
        breadcrumbs={[
          { label: "Home", href: "#" },
          { label: categoryName },
        ]}
        bgImage="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop"
        decorativeEmoji="✨"
      />

      {/* 2. Premium Product Showcase Grid */}
      <section id="products-grid" className="py-24 md:py-32 px-2 sm:px-4 md:px-12 max-w-[1600px] mx-auto z-20 relative border-t border-[var(--color-primary)]/5">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
          <div>
            <span className="text-[var(--color-primary)] font-medium tracking-[0.2em] uppercase text-xs mb-4 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-[var(--color-primary)]"></span>
              Ultra-Premium Skincare Grid
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif text-black leading-tight font-light">
              Artisanal Apothecary <br />
              <span className="italic text-[var(--color-secondary)]">Reserve Masterpieces</span>
            </h2>
          </div>
          <span className="text-xs font-medium tracking-widest uppercase text-[var(--color-dark-text)]/50 mt-4 md:mt-0 font-general">
            Showing {specialsList.length} Reserve Blends
          </span>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-[var(--color-primary)]">
            <Sparkle className="w-10 h-10 animate-spin mb-4" />
            <span className="text-xs uppercase tracking-[0.2em] font-medium font-general">Retrieving apothecary items...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-8">
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

      </section>

      {/* 3. Brand Storytelling Section */}
      <section className="relative py-28 md:py-36 px-6 md:px-12 max-w-[1600px] mx-auto z-20 border-t border-[var(--color-primary)]/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Left Column - Botanical Editorial Image */}
          <div className="lg:col-span-6 relative h-[65vh] md:h-[80vh] w-full flex items-center justify-center">
            {/* Main Image Frame (Organic curved shape) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[85%] h-full rounded-b-[18rem] rounded-t-[3rem] overflow-hidden shadow-2xl border border-white/40"
            >
              <img
                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200&auto=format&fit=crop"
                alt="Amethyst Revival Serum Visual"
                className="w-full h-full object-cover saturate-[0.8] brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-text)]/20 to-transparent pointer-events-none" />
            </motion.div>

            {/* Small Overlay Floating Image */}
            <motion.div
              initial={{ opacity: 0, x: 50, y: 50 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-[8%] right-[0%] w-[45%] aspect-[3/4] rounded-t-[8rem] rounded-b-3xl overflow-hidden border-8 border-[var(--color-background)] shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop"
                alt="Sleep Mask Curation"
                className="w-full h-full object-cover saturate-[0.8]"
              />
            </motion.div>
          </div>

          {/* Right Column - Storytelling */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <span className="text-[var(--color-primary)] font-medium tracking-[0.2em] uppercase text-xs mb-8 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-[var(--color-primary)]"></span>
              The Reserve Philosophy
            </span>
            <h3 className="text-3xl sm:text-4xl md:text-6xl font-serif text-black leading-[1.05] mb-8 font-light tracking-tight font-clash">
              Sourced in beauty, <br />
              <span className="italic font-normal text-[var(--color-primary)]">infused with energy.</span>
            </h3>

            <div className="space-y-6 text-base md:text-lg text-[var(--color-dark-text)]/75 font-light leading-relaxed max-w-xl font-satoshi">
              <p>
                True luxury skincare is not just about correcting surface dryness—it is about restoring the energetic, biological balance of skin cells. Our Hridhay Special reserve range represents our ultimate botanical commitment to this philosophy.
              </p>
              <p>
                Every ingredient is ethically harvested at the peak of its potency, slow-steamed or cold-pressed under vacuum inside sterile apothecaries to preserve active plant nutrients, and energetically aligned using natural minerals. This produces a raw, nutrient-rich formula loaded with active repair esters.
              </p>
            </div>

            {/* Micro details grid */}
            <div className="grid grid-cols-2 gap-8 mt-12 border-t border-[var(--color-primary)]/10 pt-8 max-w-lg font-serif">
              <div>
                <div className="text-4xl font-light text-black">Micro-Batch</div>
                <div className="text-[10px] uppercase tracking-widest text-[var(--color-dark-text)]/50 mt-1 font-general">Compounding Process</div>
              </div>
              <div>
                <div className="text-4xl font-light text-black">100% Clean</div>
                <div className="text-[10px] uppercase tracking-widest text-[var(--color-dark-text)]/50 mt-1 font-general">Zero Silicones or Synthetics</div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 4. Ingredient & Benefits Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-white/20 border-t border-[var(--color-primary)]/5">
        <div className="max-w-7xl mx-auto">

          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-[var(--color-primary)] font-medium tracking-[0.25em] uppercase text-xs">Botanical Ingredients</span>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif text-black mt-4 leading-tight font-light">
              Highly Potent Actives for <br />
              <span className="italic text-[var(--color-secondary)]">Dermal Transformation</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {keyIngredients.map((ing, idx) => (
              <div key={idx} className="bg-white/40 border border-white/60 p-6 rounded-[2.2rem] shadow-sm flex flex-col justify-between group/card">
                <div>
                  <div className="w-full aspect-[16/10] rounded-[1.8rem] overflow-hidden mb-6 relative">
                    <img src={ing.img} alt={ing.name} className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-[1s]" />
                  </div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h4 className="text-lg font-serif font-medium text-black">{ing.name}</h4>
                    <span className="text-[9px] uppercase tracking-widest bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2.5 py-0.5 rounded-full font-semibold">{ing.benefit}</span>
                  </div>
                  <p className="text-xs text-[var(--color-dark-text)]/70 font-light leading-relaxed font-satoshi">
                    {ing.desc}
                  </p>
                </div>
                <div className="border-t border-black/5 pt-4 mt-6 flex justify-between items-center text-[10px] text-[var(--color-dark-text)]/40 uppercase tracking-wider font-general">
                  <span>Harvest Source</span>
                  <span className="font-semibold text-[var(--color-dark-text)]/70">{ing.source}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Why Choose Hridhay Special Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch">

          <div className="bg-[var(--color-primary)] text-white p-10 rounded-[3rem] shadow-xl flex flex-col justify-between relative overflow-hidden group">
            {/* Background glowing circle */}
            <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-white/5 blur-2xl group-hover:scale-125 transition-transform duration-700" />
            <div className="relative z-10">
              <span className="text-[10px] uppercase tracking-widest text-white/60 font-semibold">Reserve Quality</span>
              <h3 className="text-3xl font-serif mt-6 mb-8 font-light leading-snug">
                Crystal-Charged <br />
                <span className="italic text-[var(--color-secondary)]">Botanical Actives</span>
              </h3>
              <p className="text-xs text-white/70 font-light font-satoshi leading-relaxed">
                We believe skin repair goes beyond surface molecules. By curing our lavender and plum seeds with natural amethyst crystals, we restore balancing resonance to skin cells.
              </p>
            </div>
            <div className="text-[10px] uppercase tracking-widest text-white/50 mt-12 border-t border-white/10 pt-4 flex justify-between items-center">
              <span>Hridhay Connect®</span>
              <span>ESTD. 2024</span>
            </div>
          </div>

          <div className="bg-white/40 border border-white/60 p-10 rounded-[3rem] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mb-6">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-xl font-serif text-black mb-4">Dermal Cell Recovery</h4>
              <p className="text-xs text-[var(--color-dark-text)]/70 font-light font-satoshi leading-relaxed">
                By infusing high-potency Vitamin C (Kakadu Plum), soothing apigenin (Chamomile), and skin repair Vitamin B3 (Niacinamide), our sleep masks and serums facilitate rapid overnight cellular recovery, tightening pores and fading spots.
              </p>
            </div>
            <div className="border-t border-black/5 pt-4 mt-8 text-[10px] text-[var(--color-dark-text)]/40 uppercase tracking-wider font-general">
              <span>Scientific Efficacy</span>
            </div>
          </div>

          <div className="bg-white/40 border border-white/60 p-10 rounded-[3rem] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mb-6">
                <Leaf className="w-5 h-5" />
              </div>
              <h4 className="text-xl font-serif text-black mb-4">Biophotonic Curing</h4>
              <p className="text-xs text-[var(--color-dark-text)]/70 font-light font-satoshi leading-relaxed">
                We completely omit chemical preservatives and parabens. Our products are packaged inside premium violet biophotonic glass that filters out visible light, allowing only protective UVA/infrared rays to sustain active shelf life.
              </p>
            </div>
            <div className="border-t border-black/5 pt-4 mt-8 text-[10px] text-[var(--color-dark-text)]/40 uppercase tracking-wider font-general">
              <span>Natural Preservation</span>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Lifestyle Experience Section */}
      <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden bg-[var(--color-dark-text)]">
        {/* Full width image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=1600&auto=format&fit=crop"
            alt="Evening Self-Care Ritual"
            className="w-full h-full object-cover brightness-[0.55] saturate-[0.8] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-cream)] via-[var(--color-dark-text)]/40 to-[var(--color-dark-text)]/70 z-10 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[var(--color-primary)]/10 blur-[80px] z-10 pointer-events-none" />
        </div>

        <div className="relative z-20 w-full max-w-4xl mx-auto px-6 text-center text-white">
          <span className="text-[var(--color-accent)] font-semibold tracking-[0.3em] uppercase text-xs block mb-6 animate-pulse">Skin Sanctuary</span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif leading-tight font-light mb-8 drop-shadow-md">
            Awaken to plump, radiant, <br />
            <span className="italic text-[var(--color-beige)] font-serif">healthy skin cells.</span>
          </h2>
          <p className="text-sm sm:text-base text-white/80 font-light font-satoshi max-w-xl mx-auto leading-relaxed drop-shadow-sm">
            Close your eyes, inhale the Provence lavender essential oils, and let our whipped niacinamide treatments repair dry environmental damage while you rest. Skincare as a daily meditation.
          </p>
        </div>
      </section>

      {/* 7. Customer Reviews Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-white/20 border-t border-[var(--color-primary)]/5">
        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-4 space-y-4 text-center lg:text-left">
              <span className="text-[var(--color-primary)] font-medium tracking-[0.2em] uppercase text-xs">Shared Experience</span>
              <h2 className="text-3xl sm:text-4xl font-serif text-black leading-tight font-light">
                Verified Skincare <br />
                <span className="italic text-[var(--color-secondary)]">Radiance Stories</span>
              </h2>

              <div className="flex flex-col items-center lg:items-start gap-2 pt-6">
                <div className="text-5xl font-serif font-light text-black">4.9</div>
                <div className="flex gap-0.5 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4.5 h-4.5 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] uppercase tracking-widest text-[var(--color-dark-text)]/50 mt-1 font-general">
                  Based on 320+ Collector Reviews
                </span>
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white/60 border border-white/80 p-8 rounded-3xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[9px] text-[var(--color-dark-text)]/40 font-general">May 24, 2026</span>
                  </div>
                  <p className="text-xs text-[var(--color-dark-text)]/80 font-light font-satoshi italic leading-relaxed mb-6">
                    “The Amethyst Revival Serum is incredible! My skin feels so calm and red dry patches have completely disappeared. The scent of lavender is beautiful and organic.”
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-black/5 pt-4">
                  <span className="text-xs font-serif font-semibold text-black">Maya V.</span>
                  <span className="text-[9px] font-semibold tracking-wider text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded-full uppercase">
                    Verified Buyer
                  </span>
                </div>
              </div>

              <div className="bg-white/60 border border-white/80 p-8 rounded-3xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[9px] text-[var(--color-dark-text)]/40 font-general">May 21, 2026</span>
                  </div>
                  <p className="text-xs text-[var(--color-dark-text)]/80 font-light font-satoshi italic leading-relaxed mb-6">
                    “I love the Lavender Sleep Mask. The whipped cream absorbs immediately without feeling heavy or oily, and my skin feels extremely soft and glowing in the morning.”
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-black/5 pt-4">
                  <span className="text-xs font-serif font-semibold text-black">Trisha G.</span>
                  <span className="text-[9px] font-semibold tracking-wider text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded-full uppercase">
                    Verified Buyer
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. FAQ Accordion Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 max-w-4xl mx-auto border-t border-[var(--color-primary)]/5">
        <div className="text-center mb-16">
          <span className="text-[var(--color-primary)] font-medium tracking-[0.25em] uppercase text-xs">Customer Inquiries</span>
          <h3 className="text-2xl sm:text-4xl font-serif text-black mt-4 leading-tight font-light">
            Frequently Asked <span className="italic text-[var(--color-secondary)]">Questions</span>
          </h3>
        </div>

        <div className="space-y-4 font-satoshi">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="bg-white/40 border border-white/50 rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex justify-between items-center w-full p-5 text-left text-black font-serif font-medium text-base cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[var(--color-primary)] transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key={`faq-content-${idx}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="p-5 pt-0 text-xs text-[var(--color-dark-text)]/70 font-light leading-relaxed border-t border-black/5">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. Premium CTA Section */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-[1600px] mx-auto z-20 relative">
        <div className="bg-gradient-to-tr from-[var(--color-primary)] via-[var(--color-secondary)] to-[#E9DFD4] rounded-[3.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl group">
          {/* Ambient Lighting Overlay */}
          <div className="absolute inset-0 bg-black/10 mix-blend-multiply z-0 pointer-events-none" />
          <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-white/10 blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">

            <span className="text-white/70 font-medium tracking-[0.3em] uppercase text-xs flex items-center gap-4 justify-center mb-6">
              <Sparkle className="w-4 h-4 text-[var(--color-accent)] animate-spin-slow" />
              <span>Reserve Skincare Compounding</span>
            </span>

            <h2 className="text-3xl sm:text-5xl md:text-7xl font-serif text-white font-light leading-[1.05] tracking-tight mb-8">
              Experience reserve <br />
              <span className="italic text-[var(--color-accent)] font-serif">botanical alchemy.</span>
            </h2>

            <p className="text-xs sm:text-sm text-white/80 font-light font-satoshi leading-relaxed max-w-xl mb-12">
              Invest in your skin's cellular recovery. Slow-stirred in violet biophotonic glass containers with no synthetic fillers, chemicals, or standard cheap silicones.
            </p>

            <button
              onClick={() => {
                const element = document.getElementById("products-grid");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded-full px-12 py-4.5 text-xs font-semibold bg-white text-[var(--color-primary)] hover:bg-[var(--color-cream)] hover:scale-[1.03] transition-all duration-300 shadow-md uppercase tracking-[0.2em] cursor-pointer"
            >
              Shop Reserve Collection
            </button>

          </div>
        </div>
      </section>

    </div>
  );
}
