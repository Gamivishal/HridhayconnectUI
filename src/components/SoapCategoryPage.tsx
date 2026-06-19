import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { Award, Heart, Leaf, Star, Sparkle, Plus, ChevronDown, Check, Info } from "lucide-react";
import { useCart } from "../context/CartContext";
import { products, syncProducts } from "../data/products";
import { InnerPageBanner } from "./InnerPageBanner";
import { getCaseInsensitiveProperty, getApiProducts, resolveImageUrl } from "../api/productService";

interface SoapCardProps {
  key?: any;
  soap: {
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
    variants?: any[];
  };
  index: number;
  cartState: Record<string, boolean>;
  wishlistState: Record<string, boolean>;
  handleAddToCart: (id: string) => void;
  toggleWishlist: (id: string) => void;
}

function SoapCard({
  soap,
  index,
  cartState,
  wishlistState,
  handleAddToCart,
  toggleWishlist
}: SoapCardProps) {
  const productRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: productRef,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const renderPrice = () => {
    if (soap.variants && soap.variants.length > 1) {
      const prices = soap.variants.map(v => v.sellPrice ?? v.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      if (minPrice === maxPrice) return `₹${minPrice}`;
      return `₹${minPrice} - ₹${maxPrice}`;
    }
    return `₹${soap.sellPrice ?? soap.price}`;
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
        window.location.hash = `#product-${soap.id}`;
      }}
    >
      <motion.div
        style={{ y: index % 2 === 1 ? (typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : y) : 0 }}
        className="w-full aspect-[4/5] bg-[var(--color-beige)]/40 rounded-[2.5rem] overflow-hidden mb-6 relative shadow-md shadow-[var(--color-dark-text)]/5 border border-white/50 group-hover:shadow-xl group-hover:shadow-[var(--color-primary)]/10 transition-shadow duration-[1.2s]"
      >
        <img
          src={soap.img}
          alt={soap.name}
          className="w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-[2.2s] ease-out brightness-95 group-hover:brightness-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-text)]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Floating Badges */}
        <div className="absolute top-5 left-5 flex flex-col gap-2 items-start">
          {/*
          // NOTE: To re-add the product tag (e.g. "Deep Purifying" or "Bestseller") in the future, uncomment this block:
          {soap.tag && (
            <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-semibold tracking-widest uppercase text-[var(--color-primary)] border border-[var(--color-primary)]/5 z-10 shadow-sm">
              {soap.tag}
            </div>
          )}
          */}
          {(() => {
            const sp = soap.sellPrice ?? soap.price;
            const op = soap.originalPrice ?? soap.price;
            const dp = soap.discountPercent ?? 0;
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
            toggleWishlist(soap.id);
          }}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-sm text-black hover:text-[var(--color-primary)] hover:scale-105 transition-all duration-300 z-10 cursor-pointer"
          aria-label="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 transition-all duration-300 ${wishlistState[soap.id] ? "fill-[var(--color-primary)] text-[var(--color-primary)] scale-110" : ""}`} />
        </button>

        {/* Quick Add To Cart overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(soap.id);
            }}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] backdrop-blur-md text-white px-8 py-3.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300 flex items-center gap-2 shadow-lg cursor-pointer"
          >
            {cartState[soap.id] ? (
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
            {soap.name}
          </h3>
          <div className="flex items-center gap-2 font-serif text-lg">
            <span className="text-[var(--color-primary)] font-semibold">{renderPrice()}</span>
            {(() => {
              const sp = soap.sellPrice ?? soap.price;
              const op = soap.originalPrice ?? soap.price;
              if (sp !== op) {
                return <span className="text-xs text-[var(--color-dark-text)]/40 line-through">₹{op}</span>;
              }
              return null;
            })()}
          </div>
        </div>

        <p className="text-[11.5px] text-[var(--color-dark-text)]/60 font-light font-satoshi mb-4 leading-relaxed line-clamp-2">
          {soap.desc}
        </p>

        {/* Subtle benefit items list */}
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
          {soap.benefits.slice(0, 2).map((benefit, idx) => (
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

const staticSoaps = [
  {
    id: "beet-radiance",
    name: "Beet Radiance Soap",
    price: 85,
    originalPrice: 160,
    img: "https://images.unsplash.com/photo-1607006342411-92f1f5449174?q=80&w=800&auto=format&fit=crop",
    desc: "Cold-pressed beetroot extracts blended with nourishing botanical oils for an organic, radiant glow.",
    benefits: ["Deeply nourishes & brightens skin", "Antioxidant-rich to even out skin tone", "Keeps skin soft, plump & hydrated"],
    tag: "Best Seller",
    ingredient: "Organic Beetroot Extract",
    discount: "47% OFF"
  },
  {
    id: "kesudo-radiance",
    name: "Kesudo Radiance Soap",
    price: 70,
    originalPrice: 130,
    img: "https://images.unsplash.com/photo-1546554137-f86b9593a222?q=80&w=800&auto=format&fit=crop",
    desc: "Infused with premium Kesudo (Saffron flower) nectars, honoring traditional Ayurvedic skin rejuvenation.",
    benefits: ["Enhances natural skin complexion", "Soothes and smooths skin texture", "Protects with bio-active antioxidants"],
    tag: "Ayurvedic Heritage",
    ingredient: "Flame of the Forest (Kesudo)",
    discount: "46% OFF"
  },
  {
    id: "neem-aloe-fresh",
    name: "Neem Aloe Fresh Soap",
    price: 70,
    originalPrice: 130,
    img: "https://images.unsplash.com/photo-1607006482945-aa1a1827402c?q=80&w=800&auto=format&fit=crop",
    desc: "A purifying, anti-bacterial blend of wild-harvested neem leaf essence and freshly extracted organic aloe vera.",
    benefits: ["Deep pore detoxification & cleansing", "Soothes acne, irritation & dry patches", "Regulates sebum without drying skin"],
    tag: "Deep Purifying",
    ingredient: "Wild Neem & Aloe Vera",
    discount: "46% OFF"
  },
  {
    id: "glow-craft-detan",
    name: "Glow Craft Detan Soap",
    price: 90,
    originalPrice: 190,
    img: "https://images.unsplash.com/photo-1605264964528-06403738d6df?q=80&w=800&auto=format&fit=crop",
    desc: "Dermatologically audited detanning soap formulated to pull out sun damage and restore your skin's natural tone.",
    benefits: ["Gently exfoliates sun-damaged layers", "Reverses tan lines & pollution buildup", "Cooling botanical relief post-sun"],
    tag: "Skin Restorative",
    ingredient: "Detanning Botanical Actives",
    discount: "52% OFF"
  },
  {
    id: "rice-potato-bliss",
    name: "Rice & Potato Bliss Soap",
    price: 90,
    originalPrice: 190,
    img: "https://images.unsplash.com/photo-1607006483224-b1523f2ec8c9?q=80&w=800&auto=format&fit=crop",
    desc: "Rich starch cream from organic rice water and active potato enzymes for fading spots and smoothing textures.",
    benefits: ["Fades dark spots & hyperpigmentation", "Aids micro-exfoliation for smooth texture", "Provides a creamy, hydrating lather"],
    tag: "Pigmentation Correcting",
    ingredient: "Rice Starch & Potato Enzymes",
    discount: "52% OFF"
  }
];

export function SoapCategoryPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [soaps, setSoaps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("Home Made Soaps");

  // Scroll to top and set page title on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Handcrafted Home Made Soaps | Hridhay Connect";
  }, []);

  // Fetch soaps from live API
  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      try {
        setIsLoading(true);
        const url = "https://localhost:7103/api/Product/GetAll";
        const body = {
          id: -2,
          categoryId: 15,
          search: ""
        };

        console.log("[SoapPage API Request] Sending payload to:", url, body);

        const token = localStorage.getItem("authToken");
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(body)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} (${response.statusText})`);
        }

        const result = await response.json();
        console.log("[SoapPage API Response] Raw JSON Response:", result);

        const apiProducts = getApiProducts(result);

        if (apiProducts.length > 0 && isMounted) {
          const apiCatName = getCaseInsensitiveProperty<string>(apiProducts[0], "CategoryName");
          if (apiCatName) {
            setCategoryName(apiCatName);
          }
        }

        // Match and overwrite only image, price, and description for the static soaps
        const updatedSoaps = staticSoaps.map(staticSoap => {
          // Find matching API product by name or SKU
          const match = apiProducts.find((apiProd: any) => {
            const prodName = getCaseInsensitiveProperty<string>(apiProd, "ProductName") || "";
            const prodSku = getCaseInsensitiveProperty<string>(apiProd, "SKU") || "";

            if (!prodName && !prodSku) return false;

            const staticNormalized = staticSoap.name.toLowerCase().replace(/soap/g, "").replace(/[^a-z0-9]/g, "").trim();
            const apiNormalizedName = prodName.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
            const apiNormalizedSku = prodSku.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
            
            return (
              (apiNormalizedName && (staticNormalized.includes(apiNormalizedName) || apiNormalizedName.includes(staticNormalized))) ||
              (apiNormalizedSku && (staticNormalized.includes(apiNormalizedSku) || apiNormalizedSku.includes(staticNormalized)))
            );
          });

          if (match) {
            console.log(`[SoapPage Matching] Matched static soap "${staticSoap.name}" with API product:`, match);
            
            // Resolve image path from the new Images array (primary first)
            let resolvedImg = "/Image/Noimage.jpg";
            const imagesArray = getCaseInsensitiveProperty<any[]>(match, "Images");

            if (Array.isArray(imagesArray) && imagesArray.length > 0) {
              // Find the primary image first, fallback to first image
              const primaryImg = imagesArray.find((img: any) => img.isPrimary || img.IsPrimary) || imagesArray[0];
              const primaryPath = primaryImg?.imagePath || primaryImg?.ImagePath || "";
              resolvedImg = resolveImageUrl(primaryPath);
            } else {
              // Fallback to legacy single ImagePath field
              const imagePathRaw = getCaseInsensitiveProperty<string>(match, "ImagePath");
              resolvedImg = resolveImageUrl(imagePathRaw);
            }

            const matchProductName = getCaseInsensitiveProperty<string>(match, "ProductName") || staticSoap.name;
            const matchProductId = getCaseInsensitiveProperty<number>(match, "ProductId");
            const matchVariantId = getCaseInsensitiveProperty<number>(match, "VarientId");
            const matchPrice = getCaseInsensitiveProperty<number>(match, "Price") || staticSoap.price;
            const matchSellPrice = getCaseInsensitiveProperty<number>(match, "SellPrice");
            const matchDiscountPercent = getCaseInsensitiveProperty<number>(match, "DiscountPercent");
            const matchDesc = getCaseInsensitiveProperty<string>(match, "ProductDescription") || staticSoap.desc;

            const resolvedSellPrice = matchSellPrice ?? matchPrice;
            const resolvedDiscountPercent = matchDiscountPercent ?? 0;

            const matchingProduct = products.find(p => p.id === staticSoap.id);
            return {
              ...staticSoap,
              name: matchProductName,
              price: matchPrice,
              sellPrice: resolvedSellPrice,
              discountPercent: resolvedDiscountPercent,
              originalPrice: matchPrice,
              discount: resolvedDiscountPercent > 0 ? `${Math.round(resolvedDiscountPercent)}% OFF` : (matchPrice !== resolvedSellPrice ? `${Math.round((1 - resolvedSellPrice / matchPrice) * 100)}% OFF` : ""),
              desc: matchDesc,
              img: resolvedImg,
              productId: matchProductId ? Number(matchProductId) : undefined,
              variantId: matchVariantId ? Number(matchVariantId) : undefined,
              variants: matchingProduct?.variants
            };
          } else {
            console.log(`[SoapPage Matching] No API match found for static soap "${staticSoap.name}". Using static data.`);
            return staticSoap;
          }
        });

        if (isMounted) {
          setSoaps(updatedSoaps);
          
          // Sync updated soaps back into the global products database
          const syncableProducts = updatedSoaps.map((s: any) => {
            const originalProduct = products.find(p => p.id === s.id);
            return {
              ...(originalProduct || {}),
              id: s.id,
              name: s.name,
              price: s.price,
              desc: s.desc,
              images: [s.img, ...(originalProduct?.images?.slice(1) || [])],
              productId: s.productId,
              variantId: s.variantId
            } as any;
          });
          syncProducts(syncableProducts);
        }
      } catch (error) {
        console.error("[SoapPage API Error] Failed to load soaps from API:", error);
        if (isMounted) {
          setSoaps(staticSoaps);
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
      name: "Beetroot active",
      source: "Organic Soil Farms",
      benefit: "Radiance & Pigmentation",
      desc: "Enriched with natural Vitamin C and betalains, beetroot helps dissolve dark spots, flushing out toxins for a natural pinkish glow.",
      img: "https://images.unsplash.com/photo-1590483736622-39da8af75bba?q=80&w=400&auto=format&fit=crop"
    },
    {
      name: "Kesudo (Saffron Flower)",
      source: "Ayurvedic Harvests",
      benefit: "Complexion Rejuvenation",
      desc: "Also known as Flame-of-the-Forest, Kesudo yields active carotenoids that shield the skin surface while promoting cellular brightening.",
      img: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=400&auto=format&fit=crop"
    },
    {
      name: "Pure Neem & Aloe",
      source: "Ethical Forest Orchards",
      benefit: "Clarifying & Hydration",
      desc: "Cold-extracted neem shields skin against micro-irritants, while Aloe Vera gel seals essential water molecules inside the dermis.",
      img: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=400&auto=format&fit=crop"
    }
  ];

  // FAQs State & Data
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqs = [
    {
      q: "Are Hridhay Connect soaps completely chemical-free?",
      a: "Yes. Our soaps are handcrafted in small batches using pure vegetable oils, cold-pressed fruit nectars, and wild-harvested herbs. We omit chemical preservatives, artificial foaming agents (SLS/SLES), silicones, and synthetic parabens entirely."
    },
    {
      q: "Which soap is best suited for fading dark spots and tan lines?",
      a: "The Glow Craft Detan Soap is specifically formulated to peel away environmental tan layers. The Rice & Potato Bliss Soap contains potato enzymes and starch which are highly effective at correcting hyperpigmentation and dark spots."
    },
    {
      q: "How should I store handcrafted cold-processed soap?",
      a: "Handcrafted soaps naturally contain high levels of skin-friendly glycerin, which attracts moisture. To make your bar last longer, store it on a well-draining soap dish in a dry area when not in use."
    },
    {
      q: "Can I use these soaps on my face as well as my body?",
      a: "Absolutely. Due to our slow cold-processing method and high superfat content, our soap bars are highly gentle and do not strip your skin of its protective moisture barrier, making them safe for facial skin."
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
        eyebrow="Skin Care"
        title={categoryName}
        titleAccent=""
        subtitle="Cold-pressed, handcrafted botanical soaps — slow-stirred with organic nectars and wild forest botanicals to nourish and purify skin."
        breadcrumbs={[
          { label: "Home", href: "#" },
          { label: categoryName },
        ]}
        bgImage="https://images.unsplash.com/photo-1607006342456-ba275cd34226?q=80&w=600&auto=format&fit=crop"
        decorativeEmoji="🌸"
      />

      {/* 2. Premium Product Showcase Grid */}
      <section id="products-grid" className="py-24 md:py-32 px-2 sm:px-4 md:px-12 max-w-[1600px] mx-auto z-20 relative border-t border-[var(--color-primary)]/5">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
          <div>
            <span className="text-[var(--color-primary)] font-medium tracking-[0.2em] uppercase text-xs mb-4 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-[var(--color-primary)]"></span>
              Slow Batch Formulation
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif text-black leading-tight font-light">
              Hand-Poured <br />
              <span className="italic text-[var(--color-secondary)]">Apothecary Masterpieces</span>
            </h2>
          </div>
          <span className="text-xs font-medium tracking-widest uppercase text-[var(--color-dark-text)]/50 mt-4 md:mt-0 font-general">
            Showing {soaps.length} Exclusive soap blends
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
            {soaps.map((soap, index) => (
              <SoapCard
                key={soap.id}
                soap={soap}
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

      {/* 3. Product Philosophy Section */}
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
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop"
                alt="Ayurvedic bath herbs extraction"
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
                src="https://images.unsplash.com/photo-1607006483224-b1523f2ec8c9?q=80&w=800&auto=format&fit=crop"
                alt="Soap curation process"
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
              The Handcrafted Philosophy
            </span>
            <h3 className="text-3xl sm:text-4xl md:text-6xl font-serif text-black leading-[1.05] mb-8 font-light tracking-tight font-clash">
              Born from the earth, <br />
              <span className="italic font-normal text-[var(--color-primary)]">cured in silence.</span>
            </h3>

            <div className="space-y-6 text-base md:text-lg text-[var(--color-dark-text)]/75 font-light leading-relaxed max-w-xl font-satoshi">
              <p>
                At Hridhay Connect, our homemade soaps are not manufactured—they are nurtured. Every bar undergoes a slow 6-week cold-curing process that preserves the natural plant glycerins and organic fatty acids, creating a dense, skin-loving conditioning lather.
              </p>
              <p>
                By avoiding high temperatures, we protect the biological active integrity of our beetroot, saffron flower (Kesudo), neem, and aloe vera essences. This slow alchemy ensures that your daily shower is transformed from a basic routine into a premium, wellness-driven skin ritual of absolute purity.
              </p>
            </div>

            {/* Micro details grid */}
            <div className="grid grid-cols-2 gap-8 mt-12 border-t border-[var(--color-primary)]/10 pt-8 max-w-lg font-serif">
              <div>
                <div className="text-4xl font-light text-black">6 Weeks</div>
                <div className="text-[10px] uppercase tracking-widest text-[var(--color-dark-text)]/50 mt-1 font-general">Cold Cure Period</div>
              </div>
              <div>
                <div className="text-4xl font-light text-black">Zero</div>
                <div className="text-[10px] uppercase tracking-widest text-[var(--color-dark-text)]/50 mt-1 font-general">Synthetic Foaming agents</div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 4. Ingredient Highlight Section */}
      <section className="relative py-28 md:py-36 bg-white/45 border-y border-[var(--color-primary)]/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-[var(--color-primary)] font-semibold tracking-[0.2em] uppercase text-xs mb-4 block">Active Botanicals</span>
            <h2 className="text-3xl md:text-5xl font-serif font-light text-black tracking-tight">The Pure Alchemy of Essence</h2>
            <p className="text-sm text-[var(--color-dark-text)]/60 font-light mt-4 font-satoshi">We ethically extract raw plant actives to deliver visible cellular benefits directly to your dermis.</p>
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

      {/* 5. Why Choose Our Soap Section */}
      <section className="relative py-28 md:py-36 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Left - Detail cards */}
          <div className="lg:col-span-6 flex flex-col justify-center order-last lg:order-first">
            <span className="text-[var(--color-primary)] font-medium tracking-[0.2em] uppercase text-xs mb-8 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-[var(--color-primary)]"></span>
              An Honest Covenant
            </span>
            <h3 className="text-3xl md:text-5xl font-serif text-black leading-tight mb-10 font-light tracking-tight">
              Absolute wellness, <br />
              <span className="italic font-normal text-[var(--color-primary)]">without compromise.</span>
            </h3>

            <div className="space-y-8 font-satoshi text-sm text-[var(--color-dark-text)]/70">
              <div className="flex gap-5 items-start">
                <div className="w-7 h-7 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 text-[var(--color-primary)] mt-1">
                  <span className="text-[10px] font-bold">01</span>
                </div>
                <div>
                  <h4 className="text-base font-serif font-medium text-black mb-1">Cold-Pressed Superfat Curing</h4>
                  <p className="font-light leading-relaxed">
                    We leave 6-8% of luxury plant butter unsaponified (superfat) to ensure a protective lipid seal remains on your skin surface.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 items-start">
                <div className="w-7 h-7 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 text-[var(--color-primary)] mt-1">
                  <span className="text-[10px] font-bold">02</span>
                </div>
                <div>
                  <h4 className="text-base font-serif font-medium text-black mb-1">100% Biodegradable & Safe</h4>
                  <p className="font-light leading-relaxed">
                    Zero trace microplastics, silicones, sulfates, or chemical run-off, protecting our water ecosystems as much as your skin body.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 items-start">
                <div className="w-7 h-7 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 text-[var(--color-primary)] mt-1">
                  <span className="text-[10px] font-bold">03</span>
                </div>
                <div>
                  <h4 className="text-base font-serif font-medium text-black mb-1">Small-Batch Artisanal Network</h4>
                  <p className="font-light leading-relaxed">
                    Supporting Indian home-artisans. Every soap purchase aids fair prices and supports micro-entrepreneurs working with heritage agriculture.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Curved Visual Composition */}
          <div className="lg:col-span-6 relative h-[60vh] w-full flex items-center justify-center">
            <div className="absolute w-[80%] h-full rounded-t-[18rem] rounded-b-[3rem] overflow-hidden shadow-2xl border border-white/30 bg-white/20">
              <img
                src="https://images.unsplash.com/photo-1607006482945-aa1a1827402c?q=80&w=1000&auto=format&fit=crop"
                alt="Botanical soap curation setup"
                className="w-full h-full object-cover saturate-[0.8] brightness-[1.05]"
              />
            </div>
            {/* Trust badge overlay */}
            <div className="absolute -left-4 top-[25%] bg-white/60 backdrop-blur-xl border border-white/60 text-[var(--color-primary)] p-5.5 rounded-3xl shadow-xl w-36 text-center animate-bounce">
              <Award className="w-7 h-7 mx-auto mb-2 text-[var(--color-primary)]" />
              <div className="text-[9px] uppercase tracking-wider font-semibold font-general">Dermatologist Audited</div>
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
                The Bathing Ritual
              </span>
              <h3 className="text-3xl md:text-5xl font-serif text-white leading-tight mb-8 font-light tracking-tight">
                Slow down, <br />
                <span className="italic font-normal text-[var(--color-accent)]">reclaim your sanctuary.</span>
              </h3>
              <p className="text-sm sm:text-base text-white/70 font-light font-satoshi leading-relaxed mb-6">
                Your skin is a sensitive biological envelope, breathing in everything you apply. Commercially processed soaps strip the skin's lipid barrier using cheap chemical detergents.
              </p>
              <p className="text-sm sm:text-base text-white/70 font-light font-satoshi leading-relaxed mb-8">
                Hridhay Connect invites you to transform your daily bath into a peaceful meditation. Wrap yourself in the organic scents of fresh beetroots, saffron flower, and pure plant nectars, aligning your rhythm back to the quiet harmony of nature.
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
                  alt="Spa self-care lifestyle setup"
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
                  \"The Beet Radiance Soap has faded my dry patch issues completely. The soap produces a soft, creamy foam, unlike other store-bought bars. Smells incredibly clean and raw.\"
                </p>
              </div>
              <div>
                <h5 className="font-serif font-medium text-black">Priya G.</h5>
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
                  \"I use the Kesudo Radiance bar on my face every morning. It has naturally evened out my skin tone and given a soft glow that commercial face washes could never match. Strongly recommend.\"
                </p>
              </div>
              <div>
                <h5 className="font-serif font-medium text-black">Aman D.</h5>
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
                  \"The Neem Aloe soap is a lifesaver for summer heat rashes. It cools down sun inflammation immediately. Buying a bundle of 5 next time! Absolute chemical-free purity.\"
                </p>
              </div>
              <div>
                <h5 className="font-serif font-medium text-black">Meera R.</h5>
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
              Return to Pure Truth
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl font-serif font-light text-white leading-[0.95] tracking-tight mb-8"
          >
            Begin your journey to <br />
            <span className="italic font-normal text-[var(--color-accent)]">botanical restoration.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="text-sm sm:text-base text-white/70 max-w-lg mb-10 font-light font-satoshi leading-relaxed"
          >
            Indulge your skin with chemical-free botanical cleansers. Ethically crafted by micro-artisans to restore biological balance and glow.
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
              Shop The Cured Bars
            </a>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
