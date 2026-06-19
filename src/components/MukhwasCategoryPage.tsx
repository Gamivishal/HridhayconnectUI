import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { Award, Heart, Leaf, Star, Sparkle, Plus, ChevronDown, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import { products, syncProducts } from "../data/products";
import { InnerPageBanner } from "./InnerPageBanner";
import { fetchProductsFromApi, normalizeSlug } from "../api/productService";

interface MukhwasCardProps {
  key?: any;
  mukhwas: {
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
  handleAddToCart: (id: string, packingType?: string) => void;
  toggleWishlist: (id: string) => void;
}

function MukhwasCard({
  mukhwas,
  index,
  cartState,
  wishlistState,
  handleAddToCart,
  toggleWishlist
}: MukhwasCardProps) {
  const [packaging, setPackaging] = useState("Pouch");
  const productRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: productRef,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const renderPrice = () => {
    if (mukhwas.variants && mukhwas.variants.length > 1) {
      const prices = mukhwas.variants.map(v => v.sellPrice ?? v.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      if (minPrice === maxPrice) return `₹${minPrice}`;
      return `₹${minPrice} - ₹${maxPrice}`;
    }
    return `₹${mukhwas.sellPrice ?? mukhwas.price}`;
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
        window.location.hash = `#product-${mukhwas.id}`;
      }}
    >
      <motion.div
        style={{ y: index % 2 === 1 ? (typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : y) : 0 }}
        className="w-full aspect-[4/5] bg-[var(--color-beige)]/40 rounded-[2.5rem] overflow-hidden mb-6 relative shadow-md shadow-[var(--color-dark-text)]/5 border border-white/50 group-hover:shadow-xl group-hover:shadow-[var(--color-primary)]/10 transition-shadow duration-[1.2s]"
      >
        <img
          src={mukhwas.img}
          alt={mukhwas.name}
          className="w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-[2.2s] ease-out brightness-95 group-hover:brightness-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-text)]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Floating Badges */}
        <div className="absolute top-5 left-5 flex flex-col gap-2 items-start">
          {/*
          // NOTE: To re-add the product tag (e.g. "Deep Purifying" or "Bestseller") in the future, uncomment this block:
          {mukhwas.tag && (
            <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-semibold tracking-widest uppercase text-[var(--color-primary)] border border-[var(--color-primary)]/5 z-10 shadow-sm">
              {mukhwas.tag}
            </div>
          )}
          */}
          {(() => {
            const sp = mukhwas.sellPrice ?? mukhwas.price;
            const op = mukhwas.originalPrice ?? mukhwas.price;
            const dp = mukhwas.discountPercent ?? 0;
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
            toggleWishlist(mukhwas.id);
          }}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-sm text-black hover:text-[var(--color-primary)] hover:scale-105 transition-all duration-300 z-10 cursor-pointer"
          aria-label="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 transition-all duration-300 ${wishlistState[mukhwas.id] ? "fill-[var(--color-primary)] text-[var(--color-primary)] scale-110" : ""}`} />
        </button>

        {/* Quick Add To Cart overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(mukhwas.id, packaging);
            }}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] backdrop-blur-md text-white px-8 py-3.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300 flex items-center gap-2 shadow-lg cursor-pointer"
          >
            {cartState[mukhwas.id] ? (
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
            {mukhwas.name}
          </h3>
          <div className="flex items-center gap-2 font-serif text-lg">
            <span className="text-[var(--color-primary)] font-semibold">{renderPrice()}</span>
            {(() => {
              const sp = mukhwas.sellPrice ?? mukhwas.price;
              const op = mukhwas.originalPrice ?? mukhwas.price;
              if (sp !== op) {
                return <span className="text-xs text-[var(--color-dark-text)]/40 line-through">₹{op}</span>;
              }
              return null;
            })()}
          </div>
        </div>

        <p className="text-[11.5px] text-[var(--color-dark-text)]/60 font-light font-satoshi mb-3 leading-relaxed line-clamp-2">
          {mukhwas.desc}
        </p>

        {/* Packaging Dropdown Selection */}
        <div 
          className="flex items-center justify-between gap-4 mt-1 mb-3 text-xs"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-[var(--color-dark-text)]/50 font-satoshi font-light">Packaging:</span>
          <select
            value={packaging}
            onChange={(e) => setPackaging(e.target.value)}
            className="bg-white/60 border border-black/10 rounded-xl px-3 py-1.5 text-xs text-[var(--color-dark-text)] focus:border-[var(--color-primary)] focus:outline-none transition-all cursor-pointer font-satoshi font-medium"
          >
            <option value="Pouch">Pouch</option>
            <option value="Bottle">Bottle</option>
          </select>
        </div>


        {mukhwas.totalAvailableStock !== undefined && mukhwas.totalAvailableStock < 10 && (
          <div className="text-[10px] font-semibold text-red-600 mb-2.5 uppercase tracking-wider">
            Available only: {mukhwas.totalAvailableStock}
          </div>
        )}

        {/* Subtle benefit items list */}
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
          {mukhwas.benefits.slice(0, 2).map((benefit, idx) => (
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

const staticMukhwas = [
  {
    id: "dil-ranjan",
    name: "Dil Ranjan Mukhwas (150g Jar)",
    price: 80,
    originalPrice: 140,
    img: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop",
    desc: "Our royal heritage digestive blend, slow-roasted over mild wood fire with fennel, sesame, coriander pulses, and spices.",
    benefits: ["Aids post-meal stomach comfort", "Rich in digestion-enhancing fibers", "100% natural, sugar-saccharin free"],
    tag: "Best Seller",
    ingredient: "Wood-Roasted Fennel & Seeds",
    discount: "42% OFF"
  },
  {
    id: "kalkatti-pan",
    name: "Kalkatti Pan Mukhwas (150g Jar)",
    price: 90,
    originalPrice: 160,
    img: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=800&auto=format&fit=crop",
    desc: "An organic blend inspired by the heritage betel leaf of Calcutta, cured with cooling gulkand and digestive seeds.",
    benefits: ["Cools stomach heat & acidity", "Fleshy rose petal base for sweetness", "Naturally refreshes bad breath"],
    tag: "Traditional Favorite",
    ingredient: "Calcutta Betel & Gulkand",
    discount: "43% OFF"
  },
  {
    id: "jamun-shot",
    name: "Jamun Shot Mukhwas (150g Jar)",
    price: 85,
    originalPrice: 150,
    img: "https://images.unsplash.com/photo-1607006342411-92f1f5449174?q=80&w=800&auto=format&fit=crop",
    desc: "A tangy, refreshing digestive pellet crafted from sun-cured jamun pulp, dry herbs, and gut-friendly spices.",
    benefits: ["Supports blood sugar balance", "Tangy, cooling after-meal refresher", "Aids digestion and gas relief"],
    tag: "Fruity Digestives",
    ingredient: "Sun-Cured Jamun Pulp",
    discount: "43% OFF"
  }
];

export function MukhwasCategoryPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [mukhwasList, setMukhwasList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("Mukhwas & Digestives");

  // Scroll to top and set page title on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Handcrafted Mukhwas & Digestives | Hridhay Connect";
  }, []);

  // Fetch mukhwas from live API
  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      try {
        setIsLoading(true);
        const fetched = await fetchProductsFromApi(17);
        if (isMounted) {
          if (fetched.length > 0 && fetched[0].categoryName) {
            setCategoryName(fetched[0].categoryName);
          }
          const cardMukhwas = fetched.map(p => ({
            id: p.id,
            name: p.name,
            price: p.originalPrice ?? p.price,
            sellPrice: p.sellPrice ?? p.price,
            discountPercent: p.discountPercent ?? 0,
            originalPrice: p.originalPrice ?? p.price,
            img: p.images[0] || "/Image/Noimage.jpg",
            desc: p.desc,
            benefits: p.benefits || [
              "Aids post-meal stomach comfort",
              "100% natural, sugar-saccharin free"
            ],
            tag: p.tag || "",
            ingredient: p.ingredients?.[0]?.name || "",
            discount: p.discount,
            totalAvailableStock: p.totalAvailableStock,
            variants: p.variants
          }));

          setMukhwasList(cardMukhwas);
          syncProducts(fetched);
        }
      } catch (error) {
        console.error("[MukhwasPage API Error] Failed to load mukhwas from API:", error);
        if (isMounted) {
          const fallbackList = staticMukhwas.map(s => {
            const matchingProduct = products.find(p => p.id === s.id);
            return {
              ...s,
              variants: matchingProduct?.variants
            };
          });
          setMukhwasList(fallbackList);
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
      name: "Roasted Fennel (Saunf)",
      source: "Heritage Spice Farms",
      benefit: "Acidity & Acclimation",
      desc: "Gently wood-roasted saunf contains active estragole and anethole, essential oils that relax intestinal muscles to prevent bloating.",
      img: "https://images.unsplash.com/photo-1628134789524-118835f8ec78?q=80&w=400&auto=format&fit=crop"
    },
    {
      name: "Sesame & Coriander Pulses",
      source: "Organic Dry Fields",
      benefit: "Fiber & Magnesium",
      desc: "Dhana dal and sesame seeds supply calcium and healthy plant oils that lubricate the digestion tract, facilitating smooth assimilation.",
      img: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=400&auto=format&fit=crop"
    },
    {
      name: "Organic Gulkand",
      source: "Srinagar Rose Gardens",
      benefit: "Cooling & Sweetness",
      desc: "Sun-cooked Damascus rose petals blended with natural sugar (mishri) to cool internal stomach heat and sweeten the palate naturally.",
      img: "https://images.unsplash.com/photo-1550950158-d0d960dff51b?q=80&w=400&auto=format&fit=crop"
    }
  ];

  // FAQs State & Data
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqs = [
    {
      q: "Are there any chemical colors or preservatives in Hridhay Connect Mukhwas?",
      a: "None. Commercial mouth fresheners are often coated with synthetic colors, glazed with chemicals, and sweetened with saccharin. Our mukhwas are 100% natural, sun-dried, and sweetened exclusively with real Gulkand or natural mishri."
    },
    {
      q: "How should these digestives be stored for freshness?",
      a: "Our mukhwas are packed inside premium, airtight jars to preserve their crunch and aroma. Store them in a cool, dry place away from direct sunlight, and always use a clean, dry spoon to serve."
    },
    {
      q: "Can children consume the Jamun Shot or Dil Ranjan Mukhwas?",
      a: "Yes, absolutely. Because our products are handcrafted using safe, traditional kitchen ingredients like roasted fennel, coriander pulses, sesame, and dried fruits, they are completely safe and healthy for children."
    },
    {
      q: "What are the health benefits of coriander pulses (Dhana Dal)?",
      a: "Dhana Dal is high in dietary fiber and essential minerals. In Ayurveda, coriander is considered a cooling spice that relieves gas, neutralizes stomach acids, and acts as an immediate post-meal digestive."
    }
  ];

  // Cart/Wishlist Interactions (for micro-interaction feedback)
  const [cartState, setCartState] = useState<Record<string, boolean>>({});
  const [wishlistState, setWishlistState] = useState<Record<string, boolean>>({});

  const { addToCart } = useCart();

  const handleAddToCart = (id: string, packingType?: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      addToCart(product, 1, packingType);
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
        eyebrow="Heritage Digestives"
        title={categoryName}
        titleAccent=""
        subtitle="Indian heritage mouth fresheners hand-roasted in artisanal batches — chemical-free, sun-cured and sweetened with natural gulkand."
        breadcrumbs={[
          { label: "Home", href: "#" },
          { label: categoryName },
        ]}
        bgImage="https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=600&auto=format&fit=crop"
        decorativeEmoji="🌿"
      />

      {/* 2. Premium Product Showcase Grid */}
      <section id="products-grid" className="py-24 md:py-32 px-2 sm:px-4 md:px-12 max-w-[1600px] mx-auto z-20 relative border-t border-[var(--color-primary)]/5">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
          <div>
            <span className="text-[var(--color-primary)] font-medium tracking-[0.2em] uppercase text-xs mb-4 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-[var(--color-primary)]"></span>
              Sun-dried digestive Curation
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif text-black leading-tight font-light">
              Heritage Crunch <br />
              <span className="italic text-[var(--color-secondary)]">For Palate Restoration</span>
            </h2>
          </div>
          <span className="text-xs font-medium tracking-widest uppercase text-[var(--color-dark-text)]/50 mt-4 md:mt-0 font-general">
            Showing {mukhwasList.length} Premium Jars
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
            {mukhwasList.map((mukhwas, index) => (
              <MukhwasCard
                key={mukhwas.id}
                mukhwas={mukhwas}
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

      {/* 3. Traditional Wellness Storytelling Section */}
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
                src="https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=1200&auto=format&fit=crop"
                alt="Ayurvedic spices and seeds being wood roasted"
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
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop"
                alt="Apothecary jar mukhwas curation"
                className="w-full h-full object-cover saturate-[0.8]"
              />
            </motion.div>
          </div>

          {/* Right Column - Philosophy storytelling */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <span className="text-[var(--color-primary)] font-medium tracking-[0.2em] uppercase text-xs mb-8 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-[var(--color-primary)]"></span>
              The Handcrafted Heritage
            </span>
            <h3 className="text-3xl sm:text-4xl md:text-6xl font-serif text-black leading-[1.05] mb-8 font-light tracking-tight font-clash">
              Roasted over fire, <br />
              <span className="italic font-normal text-[var(--color-primary)]">cured in natural sun.</span>
            </h3>

            <div className="space-y-6 text-base md:text-lg text-[var(--color-dark-text)]/75 font-light leading-relaxed max-w-xl font-satoshi">
              <p>
                In Indian homes, the after-meal digestive is a deeply rooted cultural symbol of hospitality, sharing, and stomach comfort. At Hridhay Connect, we prepare our mukhwas following authentic, wood-roasted recipes.
              </p>
              <p>
                We completely omit synthetic food coloring, chemical preservatives, and cheap artificial sweeteners. Instead, our seeds are slowly roasted over a gentle flame and cured in the warmth of the sun with real Damascus rose petals and gut-friendly spices. This slow process delivers a satisfying after-meal crunch.
              </p>
            </div>

            {/* Micro details grid */}
            <div className="grid grid-cols-2 gap-8 mt-12 border-t border-[var(--color-primary)]/10 pt-8 max-w-lg font-serif">
              <div>
                <div className="text-4xl font-light text-black">100%</div>
                <div className="text-[10px] uppercase tracking-widest text-[var(--color-dark-text)]/50 mt-1 font-general">Sun-Dried Rose Petals</div>
              </div>
              <div>
                <div className="text-4xl font-light text-black">Zero</div>
                <div className="text-[10px] uppercase tracking-widest text-[var(--color-dark-text)]/50 mt-1 font-general">Artificial Saccharin Glazes</div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 4. Ingredient Highlight Section */}
      <section className="relative py-28 md:py-36 bg-white/45 border-y border-[var(--color-primary)]/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-[var(--color-primary)] font-semibold tracking-[0.2em] uppercase text-xs mb-4 block">Active Digestives</span>
            <h2 className="text-3xl md:text-5xl font-serif font-light text-black tracking-tight">The Pure Alchemy of Gut Wellness</h2>
            <p className="text-sm text-[var(--color-dark-text)]/60 font-light mt-4 font-satoshi">We ethically extract raw plant actives to aid digestion, freshen breath, and soothe internal heat.</p>
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

      {/* 5. Why Choose Our Mukhwas Section */}
      <section className="relative py-28 md:py-36 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Left - Detail cards */}
          <div className="lg:col-span-6 flex flex-col justify-center order-last lg:order-first">
            <span className="text-[var(--color-primary)] font-medium tracking-[0.2em] uppercase text-xs mb-8 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-[var(--color-primary)]"></span>
              An Honest Covenant
            </span>
            <h3 className="text-3xl md:text-5xl font-serif text-black leading-tight mb-10 font-light tracking-tight">
              Honorable digestives, <br />
              <span className="italic font-normal text-[var(--color-primary)]">crafted with clean care.</span>
            </h3>

            <div className="space-y-8 font-satoshi text-sm text-[var(--color-dark-text)]/70">
              <div className="flex gap-5 items-start">
                <div className="w-7 h-7 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 text-[var(--color-primary)] mt-1">
                  <span className="text-[10px] font-bold">01</span>
                </div>
                <div>
                  <h4 className="text-base font-serif font-medium text-black mb-1">Authentic Sun-Cured Rose Petals</h4>
                  <p className="font-light leading-relaxed">
                    We cure our Srinagar Damascus rose petals in glass jars under direct sunlight with rock sugar (mishri) for 20 days, avoiding high heating to preserve natural coolant properties.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 items-start">
                <div className="w-7 h-7 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 text-[var(--color-primary)] mt-1">
                  <span className="text-[10px] font-bold">02</span>
                </div>
                <div>
                  <h4 className="text-base font-serif font-medium text-black mb-1">Zero Synthetic Chemical Glazes</h4>
                  <p className="font-light leading-relaxed">
                    Unlike cheap commercial pan mukhwas glazed with artificial colors and chemical petroleum waxes, our mukhwas are 100% natural and safe to consume.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 items-start">
                <div className="w-7 h-7 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 text-[var(--color-primary)] mt-1">
                  <span className="text-[10px] font-bold">03</span>
                </div>
                <div>
                  <h4 className="text-base font-serif font-medium text-black mb-1">Micro-Artisan batches</h4>
                  <p className="font-light leading-relaxed">
                    Handmade by our network of micro home-artisans. Every purchase aids fair pricing and supports rural women entrepreneurs working with traditional culinary recipes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Curved Visual Composition */}
          <div className="lg:col-span-6 relative h-[60vh] w-full flex items-center justify-center">
            <div className="absolute w-[80%] h-full rounded-t-[18rem] rounded-b-[3rem] overflow-hidden shadow-2xl border border-white/30 bg-white/20">
              <img
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop"
                alt="Traditional mukhwas curation jars"
                className="w-full h-full object-cover saturate-[0.8] brightness-[1.05]"
              />
            </div>
            {/* Trust badge overlay */}
            <div className="absolute -left-4 top-[25%] bg-white/60 backdrop-blur-xl border border-white/60 text-[var(--color-primary)] p-5.5 rounded-3xl shadow-xl w-36 text-center animate-bounce">
              <Award className="w-7 h-7 mx-auto mb-2 text-[var(--color-primary)]" />
              <div className="text-[9px] uppercase tracking-wider font-semibold font-general">Nutritional Approved</div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Lifestyle & Culture Section */}
      <section className="relative py-28 md:py-36 bg-[var(--color-dark-text)] text-[var(--color-cream)]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

            {/* Left - Story & storytelling */}
            <div className="lg:col-span-5 flex flex-col justify-center order-first">
              <span className="text-[var(--color-primary)] font-medium tracking-[0.2em] uppercase text-xs mb-8 flex items-center gap-4">
                <span className="w-12 h-[1px] bg-[var(--color-primary)]"></span>
                Athithi Devo Bhava
              </span>
              <h3 className="text-3xl md:text-5xl font-serif text-white leading-tight mb-8 font-light tracking-tight">
                Indian hospitality, <br />
                <span className="italic font-normal text-[var(--color-accent)]">cured inside the home.</span>
              </h3>
              <p className="text-sm sm:text-base text-white/70 font-light font-satoshi leading-relaxed mb-6">
                In Indian culture, the serving of mukhwas at the end of a family meal is the ultimate gesture of welcome and care. It marks a moment of transition—from the dynamic heat of the kitchen to the peaceful warmth of conversations in the living room.
              </p>
              <p className="text-sm sm:text-base text-white/70 font-light font-satoshi leading-relaxed mb-8">
                Hridhay Connect brings this sacred, slow tradition directly to your dining table. Our mukhwas blends are prepared with the same hygiene and heart as your grandmother's kitchen, allowing you to share health, digestive ease, and traditional love with those you value most.
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
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop"
                  alt="Traditional Indian dining setup with digestives"
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
                  “Dil Ranjan Mukhwas has become a mandatory post-lunch ritual in our house. It is so crunchy, roasted perfectly, and does not have that chemical sweetness of restaurant mukhwas. Love the raw cardamom hit!”
                </p>
              </div>
              <div>
                <h5 className="font-serif font-medium text-black">Radhika M.</h5>
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
                  “The Kalkatti Pan is amazing! It feels so cooling on the throat, and the gulkand flavor is incredibly rich. Safe to say my acidity issues after heavy dinners have completely disappeared.”
                </p>
              </div>
              <div>
                <h5 className="font-serif font-medium text-black">Gautam K.</h5>
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
                  “Jamun Shot is tangy, mouthwatering, and perfect after heavy meals. Extremely hygienic packaging. Highly recommend Hridhay Connect for their clean ingredients standards.”
                </p>
              </div>
              <div>
                <h5 className="font-serif font-medium text-black">Supriya R.</h5>
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
              Nourish Your Body
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl font-serif font-light text-white leading-[0.95] tracking-tight mb-8"
          >
            Restore your digestion to <br />
            <span className="italic font-normal text-[var(--color-accent)]">organic balance.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="text-sm sm:text-base text-white/70 max-w-lg mb-10 font-light font-satoshi leading-relaxed"
          >
            Indulge your palate with chemical-free sun-dried traditional mouth fresheners. Handcrafted by micro-artisans to preserve stomach comfort.
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
              Shop Handcrafted Digestives
            </a>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
