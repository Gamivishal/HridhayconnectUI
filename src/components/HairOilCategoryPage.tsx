import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { Award, Heart, Leaf, Star, Sparkle, Plus, ChevronDown, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import { products, syncProducts } from "../data/products";
import { InnerPageBanner } from "./InnerPageBanner";
import { fetchProductsFromApi } from "../api/productService";

interface HairOilCardProps {
  key?: any;
  oil: {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    sellPrice?: number;
    discountPercent?: number;
    img: string;
    desc: string;
    benefits: string[];
    tag: string;
    ingredient: string;
    discount: string;
    totalAvailableStock?: number;
    variants?: any[];
  };
  index: number;
  cartState: Record<string, boolean>;
  wishlistState: Record<string, boolean>;
  handleAddToCart: (id: string) => void;
  toggleWishlist: (id: string) => void;
}

function HairOilCard({
  oil,
  index,
  cartState,
  wishlistState,
  handleAddToCart,
  toggleWishlist
}: HairOilCardProps) {
  const productRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: productRef,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const renderPrice = () => {
    if (oil.variants && oil.variants.length > 1) {
      const prices = oil.variants.map(v => v.sellPrice ?? v.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      if (minPrice === maxPrice) return `₹${minPrice}`;
      return `₹${minPrice} - ₹${maxPrice}`;
    }
    return `₹${oil.sellPrice ?? oil.price}`;
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
        window.location.hash = `#product-${oil.id}`;
      }}
    >
      <motion.div
        style={{ y: index % 2 === 1 ? (typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : y) : 0 }}
        className="w-full aspect-[4/5] bg-[var(--color-beige)]/40 rounded-[2.5rem] overflow-hidden mb-6 relative shadow-md shadow-[var(--color-dark-text)]/5 border border-white/50 group-hover:shadow-xl group-hover:shadow-[var(--color-primary)]/10 transition-shadow duration-[1.2s]"
      >
        <img
          src={oil.img}
          alt={oil.name}
          className="w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-[2.2s] ease-out brightness-95 group-hover:brightness-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-text)]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Floating Badges */}
        <div className="absolute top-5 left-5 flex flex-col gap-2 items-start">
          {/*
          // NOTE: To re-add the product tag (e.g. "Deep Purifying" or "Bestseller") in the future, uncomment this block:
          {oil.tag && (
            <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-semibold tracking-widest uppercase text-[var(--color-primary)] border border-[var(--color-primary)]/5 z-10 shadow-sm">
              {oil.tag}
            </div>
          )}
          */}
          {(() => {
            const sp = oil.sellPrice ?? oil.price;
            const op = oil.originalPrice ?? oil.price;
            const dp = oil.discountPercent ?? 0;
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
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(oil.id);
          }}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-sm text-black hover:text-[var(--color-primary)] hover:scale-105 transition-all duration-300 z-10 cursor-pointer"
          aria-label="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 transition-all duration-300 ${wishlistState[oil.id] ? "fill-[var(--color-primary)] text-[var(--color-primary)] scale-110" : ""}`} />
        </button>

        {/* Quick Add To Cart overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(oil.id);
            }}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] backdrop-blur-md text-white px-8 py-3.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300 flex items-center gap-2 shadow-lg cursor-pointer"
          >
            {cartState[oil.id] ? (
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
            {oil.name}
          </h3>
          <div className="flex items-center gap-2 font-serif text-lg">
            <span className="text-[var(--color-primary)] font-semibold">{renderPrice()}</span>
            {(() => {
              const sp = oil.sellPrice ?? oil.price;
              const op = oil.originalPrice ?? oil.price;
              if (sp !== op) {
                return <span className="text-xs text-[var(--color-dark-text)]/40 line-through">₹{op}</span>;
              }
              return null;
            })()}
          </div>
        </div>

        <p className="text-[11.5px] text-[var(--color-dark-text)]/60 font-light font-satoshi mb-4 leading-relaxed line-clamp-2">
          {oil.desc}
        </p>

        {oil.totalAvailableStock !== undefined && oil.totalAvailableStock < 10 && (
          <div className="text-[10px] font-semibold text-red-600 mb-2.5 uppercase tracking-wider">
            Available only: {oil.totalAvailableStock}
          </div>
        )}

        {/* Subtle benefit items list */}
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
          {oil.benefits.slice(0, 2).map((benefit, idx) => (
            <li key={idx} className="flex items-center gap-1.5 text-[9.5px] text-[var(--color-dark-text)]/50 font-satoshi font-light">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]/20" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

    </motion.div>
  );
}

const staticOils = [
  {
    id: "keshvedaam-100",
    name: "Keshvedaam Hair Oil (100ml)",
    price: 210,
    originalPrice: 250,
    img: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop",
    desc: "Our flagship Ayurvedic slow-infused hair oil, hand-stirred in copper vessels with Bringraj, Amla, and organic base oils.",
    benefits: ["Nourishes the scalp & strengthens roots", "Promotes hair growth & density", "Reduces hair fall & adds natural shine"],
    tag: "Flagship Choice",
    ingredient: "Bringraj & Amla Infusion",
    discount: "16% OFF"
  },
  {
    id: "keshvedaam-200",
    name: "Keshvedaam Hair Oil (200ml)",
    price: 380,
    originalPrice: 480,
    img: "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800&auto=format&fit=crop",
    desc: "Double the quantity of our copper-cured nourishing hair nectar, designed for complete family scalp wellness.",
    benefits: ["Prevents dryness & flaky buildup", "Soothes scalp heat & inflammation", "Locks in root moisture for long hydration"],
    tag: "Best Value",
    ingredient: "Sesame & Coconut Oil Base",
    discount: "20% OFF"
  },
  {
    id: "scalp-revival-set",
    name: "Scalp Revival Ritual Set",
    price: 490,
    originalPrice: 650,
    img: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=800&auto=format&fit=crop",
    desc: "The ultimate scalp care ritual pack including Keshvedaam Oil (100ml), a handcrafted neem wood comb, and a nourishing hair pack.",
    benefits: ["Improves blood circulation in scalp", "Neem wood comb controls static frizz", "Ayurvedic hair pack strengthens cuticles"],
    tag: "Gift & Wellness Pack",
    ingredient: "Ritual Set with Neem Comb",
    discount: "24% OFF"
  }
];

export function HairOilCategoryPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [oilsList, setOilsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("Home Made Hair Oil");

  // Scroll to top and set page title on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Keshvedaam Ayurvedic Hair Oil | Hridhay Connect";
  }, []);

  // Fetch hair oils from live API (CategoryId: 16)
  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      try {
        setIsLoading(true);
        const fetched = await fetchProductsFromApi(16);
        if (isMounted) {
          if (fetched.length > 0 && fetched[0].categoryName) {
            setCategoryName(fetched[0].categoryName);
          }
          const cardOils = fetched.map(p => ({
            id: p.id,
            name: p.name,
            price: p.originalPrice ?? p.price,
            sellPrice: p.sellPrice ?? p.price,
            discountPercent: p.discountPercent ?? 0,
            originalPrice: p.originalPrice ?? p.price,
            img: p.images?.[0] || "/Image/Noimage.jpg",
            desc: p.desc,
            benefits: p.benefits || [
              "Nourishes the scalp & strengthens roots",
              "Promotes hair growth & density"
            ],
            tag: p.tag || "",
            ingredient: "",
            discount: p.discount,
            totalAvailableStock: p.totalAvailableStock,
            variants: p.variants
          }));
          setOilsList(cardOils);
          syncProducts(fetched);
        }
      } catch (error) {
        console.error("[HairOilPage API Error] Failed to load hair oils from API:", error);
        if (isMounted) {
          // Fallback to static oils enriched with variants
          const enriched = staticOils.map(oil => {
            const matchingProduct = products.find(p => p.id === oil.id || p.id.replace(/-100|-200/g, "") === oil.id.replace(/-100|-200/g, ""));
            return {
              ...oil,
              variants: matchingProduct?.variants
            };
          });
          setOilsList(enriched);
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
      name: "Bhringraj (King of Hair)",
      source: "Herbal Orchards",
      benefit: "Growth & Follicles",
      desc: "Traditionally called the ruler of hair health, Bhringraj stimulates dormant roots, improving hair thickness and texture from the root up.",
      img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=400&auto=format&fit=crop"
    },
    {
      name: "Amla (Gooseberry Nectar)",
      source: "Organic Plantations",
      benefit: "Melanin & Pigment",
      desc: "Rich in active Vitamin C and natural tannins, Amla deeply conditions dry strands, prevents premature graying, and seals natural shine.",
      img: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=400&auto=format&fit=crop"
    },
    {
      name: "Hibiscus Flowers",
      source: "Tropical Gardens",
      benefit: "Cuticle Moisture",
      desc: "Hibiscus petals release rich mucilage which acts as a natural conditioner, smoothing hair frizz and repairing split ends.",
      img: "https://images.unsplash.com/photo-1550950158-d0d960dff51b?q=80&w=400&auto=format&fit=crop"
    }
  ];

  // FAQs State & Data
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqs = [
    {
      q: "How is Keshvedaam Ayurvedic Hair Oil prepared?",
      a: "Keshvedaam is prepared using the traditional Kshirpak method. We boil active herbs in milk and base sesame oils inside copper pots for 3 days. This slow process locks in the water-soluble and lipid-soluble properties of Bhringraj and Amla, creating a highly potent hair nectar."
    },
    {
      q: "How often should I apply Keshvedaam Hair Oil?",
      a: "For optimal scalp health and root strength, we recommend massaging the oil into your scalp 2 to 3 times a week. Leave it on for at least 2 hours, or overnight, before washing it out with a mild organic cleanser."
    },
    {
      q: "Is this oil suitable for chemically treated or colored hair?",
      a: "Yes. Keshvedaam is 100% natural, chemical-free, and contains no silicones, mineral oils, or synthetic colors. It is highly gentle and acts as a restorative mask for hair damaged by chemical treatments or heat."
    },
    {
      q: "How long does it take to see results in hair fall control?",
      a: "Most customers report a visible reduction in hair fall and dry scalp flakes within 3 to 4 weeks of consistent application, as the active Ayurvedic herbs nourish and soothe the hair follicles."
    }
  ];

  // Cart/Wishlist Interactions (for micro-interaction feedback)
  const [cartState, setCartState] = useState<Record<string, boolean>>({});
  const [wishlistState, setWishlistState] = useState<Record<string, boolean>>({});

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

  const toggleWishlist = (id: string) => {
    setWishlistState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div ref={pageRef} className="relative w-full bg-[var(--color-cream)] text-[var(--color-dark-text)] overflow-hidden font-sans">

      <InnerPageBanner
        eyebrow="Hair Wellness"
        title={categoryName}
        titleAccent=""
        subtitle="Traditional copper-cured Ayurvedic hair oils, slow-infused with Bhringraj, Amla, and Hibiscus for deep root nourishment."
        breadcrumbs={[
          { label: "Home", href: "#" },
          { label: categoryName },
        ]}
        bgImage="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=600&auto=format&fit=crop"
        decorativeEmoji="🌺"
      />

      {/* 2. Premium Product Showcase Grid */}
      <section id="products-grid" className="py-24 md:py-32 px-2 sm:px-4 md:px-12 max-w-[1600px] mx-auto z-20 relative border-t border-[var(--color-primary)]/5">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
          <div>
            <span className="text-[var(--color-primary)] font-medium tracking-[0.2em] uppercase text-xs mb-4 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-[var(--color-primary)]"></span>
              Keshvedaam Apothecary
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif text-black leading-tight font-light">
              Nourishing Nectars <br />
              <span className="italic text-[var(--color-secondary)]">For Root Restoration</span>
            </h2>
          </div>
          <span className="text-xs font-medium tracking-widest uppercase text-[var(--color-dark-text)]/50 mt-4 md:mt-0 font-general">
            Showing {oilsList.length} Exclusive Cured Oils
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
            {oilsList.map((oil, index) => (
              <HairOilCard
                key={oil.id}
                oil={oil}
                index={index}
                cartState={cartState}
                wishlistState={wishlistState}
                handleAddToCart={handleAddToCart}
                toggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        )}

      </section>

      {/* 3. Hair Wellness Storytelling Section */}
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
                src="https://images.unsplash.com/photo-1519735777090-ec97162ec268?q=80&w=1200&auto=format&fit=crop"
                alt="Ayurvedic herb curing and oil preparation"
                className="w-full h-full object-cover saturate-[0.8] brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-text)]/20 to-transparent pointer-events-none" />
            </motion.div>

            {/* Small Overlay Floating Image */}
            <motion.div
              initial={{ opacity: 0, x: -50, y: 50 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-[8%] left-[0%] w-[45%] aspect-[3/4] rounded-t-[8rem] rounded-b-3xl overflow-hidden border-8 border-[var(--color-background)] shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=800&auto=format&fit=crop"
                alt="Oil ritual application"
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
              The Kshirpak Infusion Method
            </span>
            <h3 className="text-3xl sm:text-4xl md:text-6xl font-serif text-black leading-[1.05] mb-8 font-light tracking-tight font-clash">
              Three days in copper, <br />
              <span className="italic font-normal text-[var(--color-primary)]">sealed in absolute potency.</span>
            </h3>

            <div className="space-y-6 text-base md:text-lg text-[var(--color-dark-text)]/75 font-light leading-relaxed max-w-xl font-satoshi">
              <p>
                Unlike commercial hair oils that dilute mineral bases with chemical perfumes, Keshvedaam Ayurvedic Hair Oil is hand-infused inside traditional copper pots using the slow Kshirpak method.
              </p>
              <p>
                We boil fresh Bringraj leaves, raw Amla fruits, and conditioning hibiscus flowers in organic sesame and coconut base oils for 3 consecutive days. This slow heat extraction binds the restorative micro-nutrients in their natural forms, supplying pure nourishment straight to your scalp and hair follicles.
              </p>
            </div>

            {/* Micro details grid */}
            <div className="grid grid-cols-2 gap-8 mt-12 border-t border-[var(--color-primary)]/10 pt-8 max-w-lg font-serif">
              <div>
                <div className="text-4xl font-light text-black">72 Hours</div>
                <div className="text-[10px] uppercase tracking-widest text-[var(--color-dark-text)]/50 mt-1 font-general">Slow Copper Infusion</div>
              </div>
              <div>
                <div className="text-4xl font-light text-black">Zero</div>
                <div className="text-[10px] uppercase tracking-widest text-[var(--color-dark-text)]/50 mt-1 font-general">Mineral Oils & Silicones</div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 4. Ingredient Benefits Section */}
      <section className="relative py-28 md:py-36 bg-white/45 border-y border-[var(--color-primary)]/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-[var(--color-primary)] font-semibold tracking-[0.2em] uppercase text-xs mb-4 block">Active Botanicals</span>
            <h2 className="text-3xl md:text-5xl font-serif font-light text-black tracking-tight">The Pure Alchemy of Hair Wellness</h2>
            <p className="text-sm text-[var(--color-dark-text)]/60 font-light mt-4 font-satoshi">We ethically extract raw plant actives to nourish, strengthen, and soothe your hair roots.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {keyIngredients.map((ing, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="bg-white/40 border border-white/60 p-6 rounded-[2.2rem] backdrop-blur-md shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6">
                    <img src={ing.img} alt={ing.name} className="w-full h-full object-cover saturate-[0.8]" />
                  </div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h4 className="text-lg font-serif font-medium text-black">{ing.name}</h4>
                    <span className="text-[9px] uppercase tracking-widest bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-0.5 rounded-full font-semibold">{ing.benefit}</span>
                  </div>
                  <p className="text-xs text-[var(--color-dark-text)]/70 font-light leading-relaxed font-satoshi">
                    {ing.desc}
                  </p>
                </div>
                <div className="border-t border-black/5 pt-4 mt-6 flex justify-between items-center text-[10px] text-[var(--color-dark-text)]/40 uppercase tracking-wider font-general">
                  <span>Source</span>
                  <span className="font-medium text-[var(--color-dark-text)]/70">{ing.source}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why Choose Our Hair Oil Section */}
      <section className="relative py-28 md:py-36 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Left - Detail cards */}
          <div className="lg:col-span-6 flex flex-col justify-center order-last lg:order-first">
            <span className="text-[var(--color-primary)] font-medium tracking-[0.2em] uppercase text-xs mb-8 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-[var(--color-primary)]"></span>
              An Honest Covenant
            </span>
            <h3 className="text-3xl md:text-5xl font-serif text-black leading-tight mb-10 font-light tracking-tight">
              Honorable scalp care, <br />
              <span className="italic font-normal text-[var(--color-primary)]">nurtured by hand.</span>
            </h3>

            <div className="space-y-8 font-satoshi text-sm text-[var(--color-dark-text)]/70">
              <div className="flex gap-5 items-start">
                <div className="w-7 h-7 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 text-[var(--color-primary)] mt-1">
                  <span className="text-[10px] font-bold">01</span>
                </div>
                <div>
                  <h4 className="text-base font-serif font-medium text-black mb-1">Authentic Kshirpak Preparation</h4>
                  <p className="font-light leading-relaxed">
                    We never rush. Our 72-hour slow copper pot brewing process ensures that the botanical nutrients are tightly bound without mineral oil fillers.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 items-start">
                <div className="w-7 h-7 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 text-[var(--color-primary)] mt-1">
                  <span className="text-[10px] font-bold">02</span>
                </div>
                <div>
                  <h4 className="text-base font-serif font-medium text-black mb-1">Cold-Pressed Sesame & Coconut Base</h4>
                  <p className="font-light leading-relaxed">
                    We source nutrient-dense cold-pressed sesame and virgin coconut base oils, feeding essential fatty acids and vitamins directly to roots.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 items-start">
                <div className="w-7 h-7 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 text-[var(--color-primary)] mt-1">
                  <span className="text-[10px] font-bold">03</span>
                </div>
                <div>
                  <h4 className="text-base font-serif font-medium text-black mb-1">Artisanalbatched Network</h4>
                  <p className="font-light leading-relaxed">
                    Hand-poured by small-scale home artisans. Every purchase helps preserve Indian heritage farming and provides fair-wage support to micro-producers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Curved Visual Composition */}
          <div className="lg:col-span-6 relative h-[60vh] w-full flex items-center justify-center">
            <div className="absolute w-[80%] h-full rounded-t-[18rem] rounded-b-[3rem] overflow-hidden shadow-2xl border border-white/30 bg-white/20">
              <img
                src="https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=1000&auto=format&fit=crop"
                alt="Apothecary hair wellness curation"
                className="w-full h-full object-cover saturate-[0.8] brightness-[1.05]"
              />
            </div>
            {/* Trust badge overlay */}
            <div className="absolute -left-4 top-[25%] bg-white/60 backdrop-blur-xl border border-white/60 text-[var(--color-primary)] p-5.5 rounded-3xl shadow-xl w-36 text-center animate-bounce">
              <Award className="w-7 h-7 mx-auto mb-2 text-[var(--color-primary)]" />
              <div className="text-[9px] uppercase tracking-wider font-semibold font-general">Dermatologist Tested</div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Wellness Lifestyle Section */}
      <section className="relative py-28 md:py-36 bg-[var(--color-dark-text)] text-[var(--color-cream)]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

            {/* Left - Story & storytelling */}
            <div className="lg:col-span-5 flex flex-col justify-center order-first">
              <span className="text-[var(--color-primary)] font-medium tracking-[0.2em] uppercase text-xs mb-8 flex items-center gap-4">
                <span className="w-12 h-[1px] bg-[var(--color-primary)]"></span>
                The Scalp Massage Ritual
              </span>
              <h3 className="text-3xl md:text-5xl font-serif text-white leading-tight mb-8 font-light tracking-tight">
                Slow down, <br />
                <span className="italic font-normal text-[var(--color-accent)]">rejuvenate with a Champi.</span>
              </h3>
              <p className="text-sm sm:text-base text-white/70 font-light font-satoshi leading-relaxed mb-6">
                In traditional Indian households, oiling hair is not a grooming chore—it is an act of deep connection and self-devotion. Scalp massage, or Champi, increases local blood circulation, bringing oxygen and essential nutrients directly to the follicles.
              </p>
              <p className="text-sm sm:text-base text-white/70 font-light font-satoshi leading-relaxed mb-8">
                Warm 1-2 tablespoons of Keshvedaam Hair Oil in your palms. Gently work it into your scalp using circular fingertips motions, focusing on the crown area to soothe tension and stress. It is a quiet meditation that conditions your strands and restores absolute peace.
              </p>
            </div>

            {/* Right - Immersive Landscape Imagery */}
            <div className="lg:col-span-7 relative h-[50vh] md:h-[70vh] w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.6 }}
                className="w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10"
              >
                <img
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb046eb9?q=80&w=1200&auto=format&fit=crop"
                  alt="Traditional Ayurvedic massage lifestyle"
                  className="w-full h-full object-cover saturate-[0.8] brightness-90"
                />
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Customer Reviews Section */}
      <section className="relative py-28 bg-white/40 border-b border-[var(--color-primary)]/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-[var(--color-primary)] font-semibold tracking-[0.2em] uppercase text-xs mb-4 block">Shared Reverence</span>
            <h2 className="text-3xl md:text-5xl font-serif font-light text-black tracking-tight">Verified Collector Journeys</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/50 border border-white/70 p-8 rounded-3xl backdrop-blur-md shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 text-[var(--color-primary)] mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <p className="text-sm text-[var(--color-dark-text)]/85 font-light font-satoshi italic leading-relaxed mb-8">
                  “Keshvedaam is the only oil that has successfully controlled my seasonal hair fall. Within 3 weeks, my scalp feels moisturized and I see so many new baby hairs growing at my temples!”
                </p>
              </div>
              <div>
                <h5 className="font-serif font-medium text-black">Rohini S.</h5>
                <span className="text-[10px] uppercase tracking-widest text-[var(--color-dark-text)]/50 font-general">Verified Collector</span>
              </div>
            </motion.div>

            {/* Review 2 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/50 border border-white/70 p-8 rounded-3xl backdrop-blur-md shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 text-[var(--color-primary)] mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <p className="text-sm text-[var(--color-dark-text)]/85 font-light font-satoshi italic leading-relaxed mb-8">
                  “I love that this oil does not contain mineral base oils. It washes out easily without leaving any sticky residue. My hair feels incredibly soft, smooth, and smells naturally of Ayurvedic herbs.”
                </p>
              </div>
              <div>
                <h5 className="font-serif font-medium text-black">Vikram P.</h5>
                <span className="text-[10px] uppercase tracking-widest text-[var(--color-dark-text)]/50 font-general">Verified Collector</span>
              </div>
            </motion.div>

            {/* Review 3 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/50 border border-white/70 p-8 rounded-3xl backdrop-blur-md shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 text-[var(--color-primary)] mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <p className="text-sm text-[var(--color-dark-text)]/85 font-light font-satoshi italic leading-relaxed mb-8">
                  “Buying the Scalp Revival Set was so worth it. The neem wood comb is a game changer for static frizz after showers. The oil feels luxury and cured. Highly recommend Hridhay Connect!”
                </p>
              </div>
              <div>
                <h5 className="font-serif font-medium text-black">Shalini V.</h5>
                <span className="text-[10px] uppercase tracking-widest text-[var(--color-dark-text)]/50 font-general">Verified Collector</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section className="relative py-24 md:py-32 max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[var(--color-primary)] font-semibold tracking-[0.2em] uppercase text-xs mb-4 block">Apothecary Queries</span>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-black tracking-tight">Frequently Asked Secrets</h2>
        </div>

        <div className="space-y-4 font-satoshi">
          {faqs.map((faq, idx) => {
            const isOpened = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white/40 border border-white/50 rounded-2xl shadow-sm overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(isOpened ? null : idx)}
                  className="flex justify-between items-center w-full p-6 text-left text-black font-serif text-lg font-medium cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[var(--color-primary)] transition-transform duration-300 ${isOpened ? "rotate-180" : "rotate-0"}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpened && (
                    <motion.div
                      key={`faq-content-${idx}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="p-6 pt-0 text-sm text-[var(--color-dark-text)]/70 font-light leading-relaxed border-t border-black/5">
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
      <section className="relative py-28 md:py-40 bg-[var(--color-dark-text)] text-[var(--color-cream)] overflow-hidden">
        {/* Ambient Radial Gradient Glow */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[65vw] h-[65vw] rounded-full bg-[var(--color-primary)]/20 blur-[130px] mix-blend-screen" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="flex items-center gap-2 mb-6 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full backdrop-blur-md"
          >
            <Sparkle className="w-3.5 h-3.5 text-[var(--color-accent)] animate-spin-slow" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white">
              Nourish Your Crown
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl font-serif font-light text-white leading-[0.95] tracking-tight mb-8"
          >
            Restore your roots to <br />
            <span className="italic font-normal text-[var(--color-accent)]">organic balance.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="text-sm sm:text-base text-white/70 max-w-lg mb-10 font-light font-satoshi leading-relaxed"
          >
            Nourish dry scalps and stop hair fall with slow-brewed Bringraj active infusions. Handcrafted with traditional care for your modern hair rituals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.5 }}
          >
            <a
              href="#products-grid"
              className="rounded-full px-12 py-5 text-xs font-semibold bg-[var(--color-primary)]/80 text-white border border-white/20 backdrop-blur-md hover:bg-[var(--color-primary)] hover:scale-[1.03] transition-all duration-300 shadow-xl uppercase tracking-widest font-general cursor-pointer"
            >
              Shop The Cured Oils
            </a>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
