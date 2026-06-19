export interface ProductIngredient {
  name: string;
  source: string;
  benefit: string;
  desc: string;
  img: string;
}

export interface ProductReview {
  author: string;
  rating: number;
  text: string;
  date: string;
  tag?: string;
}

export interface ProductFAQ {
  q: string;
  a: string;
}

export interface ProductVariant {
  varientId: number;
  variantAttributeValues_Only: string;
  variantAttributes: string;
  sku: string;
  price: number;
  sellPrice?: number;
  discountPercent?: number;
  isPercentagePricing?: boolean;
  imagePath: string;
  totalAvailableStock: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: string;
  tag: string;
  images: string[];
  category: 'soap' | 'hair-oil' | 'mukhwas' | 'tea-masala' | 'hridhay-special';
  tagline: string;
  rating: number;
  ratingCount: number;
  desc: string;
  longDesc: string;
  benefits: string[];
  ingredients: ProductIngredient[];
  usage: string[];
  highlights: string[];
  reviews: ProductReview[];
  faqs: ProductFAQ[];
  variants?: ProductVariant[];
  totalAvailableStock?: number;
  productId?: number;
  variantId?: number;
  categoryName?: string;
  sellPrice?: number;
  discountPercent?: number;
  isPercentagePricing?: boolean;
}


export const products: Product[] = [
  // 1. Soaps
  {
    id: "beet-radiance",
    name: "Beet Radiance Soap",
    price: 85,
    originalPrice: 160,
    discount: "47% OFF",
    tag: "Best Seller",
    images: [
      "https://images.unsplash.com/photo-1607006342411-92f1f5449174?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590483736622-39da8af75bba?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1607006482945-aa1a1827402c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop"
    ],
    category: "soap",
    tagline: "Cold-pressed beetroot nectar for an organic pinkish glow.",
    rating: 4.8,
    ratingCount: 148,
    desc: "Cold-pressed beetroot extracts blended with nourishing botanical oils for an organic, radiant glow.",
    longDesc: "Experience skincare elevated into a sacred daily ritual. Hand-stirred using nutrient-dense cold-pressed vegetable oils, organic beetroot nectars, and raw therapeutic forest botanicals, our Beet Radiance Soap gently clarifies the dermis without stripping protective natural lipids.",
    benefits: [
      "Deeply nourishes & brightens dull skin",
      "Rich in active betalains that help dissolve pigmentation",
      "Keeps skin soft, plump, and thoroughly hydrated"
    ],
    ingredients: [
      {
        name: "Beetroot Active Extract",
        source: "Organic Soil Farms",
        benefit: "Radiance & Tan Removal",
        desc: "Enriched with natural Vitamin C and betalains, beetroot helps dissolve dark spots, flushing out toxins for a natural pinkish glow.",
        img: "https://images.unsplash.com/photo-1590483736622-39da8af75bba?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "Cold-Pressed Coconut Oil",
        source: "Coastal Kerala Groves",
        benefit: "Hydration Barrier",
        desc: "Supplies essential medium-chain fatty acids that build a breathable moisture barrier, sealing water molecules inside the skin.",
        img: "https://images.unsplash.com/photo-1607006482945-aa1a1827402c?q=80&w=400&auto=format&fit=crop"
      }
    ],
    usage: [
      "Wet your skin with warm water to open pores.",
      "Work up a rich, creamy lather between your palms.",
      "Gently massage the lather onto your face and body in circular motions.",
      "Rinse thoroughly with cool water and pat dry."
    ],
    highlights: ["Sulphate & Paraben Free", "6-Week Cold-Processed", "Biodegradable Formula", "Fair Trade Sourced"],
    reviews: [
      {
        author: "Priya G.",
        rating: 5,
        text: "The Beet Radiance Soap has faded my dry patch issues completely. The soap produces a soft, creamy foam, unlike other store-bought bars. Smells incredibly clean and raw.",
        date: "May 12, 2026",
        tag: "Verified Collector"
      },
      {
        author: "Anjali K.",
        rating: 4.8,
        text: "My skin tone has visibly evened out in just two weeks. It feels extremely moisturizing on my dry skin.",
        date: "May 08, 2026",
        tag: "Verified Collector"
      }
    ],
    faqs: [
      {
        q: "Is this soap suitable for sensitive facial skin?",
        a: "Yes. Our cold-processed soaps are superfatted by 6-8%, which means a portion of nourishing plant oils remains un-saponified. This makes the bar extremely mild and suitable for facial skin."
      },
      {
        q: "Why does handcrafted soap melt faster?",
        a: "Handcrafted soaps naturally contain high levels of skin-friendly glycerin, which attracts moisture. To make your bar last longer, store it on a well-draining soap dish in a dry area when not in use."
      }
    ]
  },
  {
    id: "kesudo-radiance",
    name: "Kesudo Radiance Soap",
    price: 70,
    originalPrice: 130,
    discount: "46% OFF",
    tag: "Ayurvedic Heritage",
    images: [
      "https://images.unsplash.com/photo-1546554137-f86b9593a222?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=800&auto=format&fit=crop"
    ],
    category: "soap",
    tagline: "Flame of the Forest flowers for traditional Ayurvedic skin rejuvenation.",
    rating: 4.7,
    ratingCount: 112,
    desc: "Infused with premium Kesudo (Saffron flower) nectars, honoring traditional Ayurvedic skin rejuvenation.",
    longDesc: "Historically prepared as a royal bathing ritual, our Kesudo Radiance Soap utilizes nectars extracted from the Flame-of-the-Forest flower. Formulated to neutralize surface heat, reduce summer skin irritations, and enhance natural complexion glow.",
    benefits: [
      "Enhances natural skin complexion and tone",
      "Soothes sunburns, skin heat, and minor rashes",
      "Protects skin cells with bio-active antioxidants"
    ],
    ingredients: [
      {
        name: "Kesudo Flower Extract",
        source: "Ayurvedic Harvests",
        benefit: "Soothe & Brighten",
        desc: "Also known as Flame-of-the-Forest, Kesudo yields active carotenoids that shield the skin surface while promoting cellular brightening.",
        img: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=400&auto=format&fit=crop"
      }
    ],
    usage: [
      "Wet your body with cool or lukewarm water.",
      "Lather the Kesudo bar directly on the skin.",
      "Leave the creamy lather on for 30 seconds for active herbs to soothe the skin.",
      "Rinse off and enjoy the cooling comfort."
    ],
    highlights: ["100% Vegan", "Natural Coolant Properties", "Zero Chemical Colors", "Ayurvedic Pharmacopoeia Approved"],
    reviews: [
      {
        author: "Aman D.",
        rating: 5,
        text: "I use the Kesudo Radiance bar on my face every morning. It has naturally evened out my skin tone and given a soft glow that commercial face washes could never match.",
        date: "May 15, 2026",
        tag: "Verified Collector"
      }
    ],
    faqs: [
      {
        q: "What is Kesudo?",
        a: "Kesudo (Butea Monosperma) is a heritage Indian tree. Its bright orange flowers have been used in Ayurveda for centuries to cure skin heat, soothe rashes, and improve overall skin complexion."
      }
    ]
  },
  {
    id: "neem-aloe-fresh",
    name: "Neem Aloe Fresh Soap",
    price: 70,
    originalPrice: 130,
    discount: "46% OFF",
    tag: "Deep Purifying",
    images: [
      "https://images.unsplash.com/photo-1607006482945-aa1a1827402c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop"
    ],
    category: "soap",
    tagline: "Purifying wild neem leaf and freshly extracted organic aloe vera.",
    rating: 4.9,
    ratingCount: 196,
    desc: "A purifying, anti-bacterial blend of wild-harvested neem leaf essence and freshly extracted organic aloe vera.",
    longDesc: "The ultimate defense for acne-prone, oily, or irritated skin. This clarifying formulation pairs the powerful antibacterial active nimbin from wild-harvested neem leaves with the cooling, cell-regenerating hydration of organic aloe vera inner-leaf gel.",
    benefits: [
      "Deep pore detoxification and bacterial defense",
      "Soothes active acne, inflammation, and dry patches",
      "Regulates excess sebum production without drying skin"
    ],
    ingredients: [
      {
        name: "Pure Neem Extract",
        source: "Ethical Forest Orchards",
        benefit: "Anti-Bacterial Active",
        desc: "Cold-extracted neem shields skin against micro-irritants, bacteria, and fungal outbreaks while cleansing clogged pores.",
        img: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "Organic Aloe Vera Gel",
        source: "In-House Organic Gardens",
        benefit: "Soothe & Heal",
        desc: "Rich in active enzymes and polysaccharides, aloe gel seals essential moisture molecules and aids skin cell repair.",
        img: "https://images.unsplash.com/photo-1607006482945-aa1a1827402c?q=80&w=400&auto=format&fit=crop"
      }
    ],
    usage: [
      "Work up a rich lather on wet hands.",
      "Focus application on acne-prone areas or clogged facial pores.",
      "Massage for 45 seconds to let the neem nimbin active work.",
      "Rinse with lukewarm water and pat dry."
    ],
    highlights: ["Soothes Inflations", "Non-Comedogenic", "100% Biodegradable", "Zero Artificial Fragrance"],
    reviews: [
      {
        author: "Meera R.",
        rating: 5,
        text: "The Neem Aloe soap is a lifesaver for summer heat rashes. It cools down sun inflammation immediately. Buying a bundle of 5 next time! Absolute chemical-free purity.",
        date: "May 20, 2026",
        tag: "Verified Collector"
      }
    ],
    faqs: [
      {
        q: "Will this dry out my facial skin?",
        a: "No. Unlike commercial antibacterial soaps that use harsh chemicals like triclosan, our soap cleanses using organic saponified oils and aloe vera, which naturally balance hydration."
      }
    ]
  },
  {
    id: "glow-craft-detan",
    name: "Glow Craft Detan Soap",
    price: 90,
    originalPrice: 190,
    discount: "52% OFF",
    tag: "Skin Restorative",
    images: [
      "https://images.unsplash.com/photo-1605264964528-06403738d6df?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590483736622-39da8af75bba?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=800&auto=format&fit=crop"
    ],
    category: "soap",
    tagline: "Dermatologically audited detanning botanical actives.",
    rating: 4.6,
    ratingCount: 88,
    desc: "Dermatologically audited detanning soap formulated to pull out sun damage and restore your skin's natural tone.",
    longDesc: "Specially formulated for post-sun recovery, our Glow Craft Detan Soap contains active botanical enzymes that target micro-damaged surface cells. It gently removes sun-tan buildup and returns the skin to its natural, healthy uniform tone.",
    benefits: [
      "Gently exfoliates sun-damaged surface layers",
      "Reverses tan lines, dullness, and pollution buildup",
      "Provides immediate cooling botanical relief post-sun"
    ],
    ingredients: [
      {
        name: "Detanning Botanical Actives",
        source: "Western Ghats Orchards",
        benefit: "Tan Extraction",
        desc: "Natural plant enzymes that gently dissolve pigmented surface skin cells, speeding up skin renewal without harsh abrasion.",
        img: "https://images.unsplash.com/photo-1590483736622-39da8af75bba?q=80&w=400&auto=format&fit=crop"
      }
    ],
    usage: [
      "Apply directly to sun-exposed parts of the body.",
      "Gently scrub using your hands or a soft loofah.",
      "Leave the active lather on for 1 minute.",
      "Rinse with clean, cool water."
    ],
    highlights: ["Dermatologically Audited", "Post-Sun Care", "Mild Natural Exfoliation", "Sulphate Free"],
    reviews: [
      {
        author: "Kunal S.",
        rating: 4.5,
        text: "Used this after my beach vacation. It successfully lightened the harsh tan lines on my arms. Smells very refreshing, and skin doesn't feel dried out.",
        date: "May 18, 2026",
        tag: "Verified Collector"
      }
    ],
    faqs: [
      {
        q: "Does it contain bleach or chemical lighteners?",
        a: "Absolutely not. Our Detan Soap uses natural plant enzymes and fruit acids that facilitate gentle, biological micro-exfoliation to reveal your natural tone."
      }
    ]
  },
  {
    id: "rice-potato-bliss",
    name: "Rice & Potato Bliss Soap",
    price: 90,
    originalPrice: 190,
    discount: "52% OFF",
    tag: "Pigmentation Correcting",
    images: [
      "https://images.unsplash.com/photo-1607006483224-b1523f2ec8c9?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1607006342411-92f1f5449174?q=80&w=800&auto=format&fit=crop"
    ],
    category: "soap",
    tagline: "Organic rice water starch and active potato enzymes for spot correction.",
    rating: 4.8,
    ratingCount: 130,
    desc: "Rich starch cream from organic rice water and active potato enzymes for fading spots and smoothing textures.",
    longDesc: "Crafted as a premium skin smoothing bar, Rice & Potato Bliss brings together two age-old kitchen secrets. Concentrated rice water starch supplies skin-strengthening ceramides, while raw potato juices containing catecholase enzymes actively fade dark spots, blemishes, and acne scars.",
    benefits: [
      "Fades dark spots, blemishes, and hyperpigmentation",
      "Aids gentle micro-exfoliation for smooth skin texture",
      "Provides a deeply creamy, hydrating, and rich lather"
    ],
    ingredients: [
      {
        name: "Rice Starch Cream",
        source: "Himalayan Foothill Farms",
        benefit: "Ceramide Synthesis",
        desc: "Fermented rice water starch is rich in amino acids and minerals that strengthen the skin's moisture barrier and refine pores.",
        img: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "Potato Enzyme Extract",
        source: "Organic Soil Estates",
        benefit: "Melanin Regulation",
        desc: "Fresh potato starch contains catecholase, a natural enzyme that reduces hyperpigmentation, dark circles, and acne blemishes.",
        img: "https://images.unsplash.com/photo-1607006342411-92f1f5449174?q=80&w=400&auto=format&fit=crop"
      }
    ],
    usage: [
      "Wet the soap bar to create a dense, milky lather.",
      "Massage the lather onto your face, focusing on dark spots or pigmented areas.",
      "Let the lather sit for 30-45 seconds.",
      "Rinse with clean water and dry."
    ],
    highlights: ["Fades Hyperpigmentation", "Rich in Rice Ceramides", "Chemical Preservative Free", "pH Balanced"],
    reviews: [
      {
        author: "Kavita R.",
        rating: 5,
        text: "This soap works wonders for acne scars! My dark marks have significantly faded over the last 3 weeks. The lather is so thick and feels like a luxurious milk wash.",
        date: "May 22, 2026",
        tag: "Verified Collector"
      }
    ],
    faqs: [
      {
        q: "Can this soap be used on oily skin?",
        a: "Yes, it is suitable for all skin types. Rice water starch helps control excess surface sebum, while potato extracts keep the skin hydrated and glowing."
      }
    ]
  },

  // 2. Hair Oils
  {
    id: "keshvedaam-100",
    name: "Keshvedaam Hair Oil (100ml)",
    price: 210,
    originalPrice: 250,
    discount: "16% OFF",
    tag: "Flagship Choice",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519735777090-ec97162ec268?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop"
    ],
    category: "hair-oil",
    tagline: "Ayurvedic slow-infused Bringraj and Amla copper-brewed hair nectar.",
    rating: 4.8,
    ratingCount: 165,
    desc: "Our flagship Ayurvedic slow-infused hair oil, hand-stirred in copper vessels with Bringraj, Amla, and organic base oils.",
    longDesc: "Dilute mineral oils and synthetic colors are absent from Keshvedaam. Prepared using the traditional Kshirpak method, we boil active Bhringraj leaves and fresh Amla fruits in milk and organic base oils inside pure copper pots for 3 days. This slow process seals botanical actives straight to the roots.",
    benefits: [
      "Deeply nourishes the scalp and strengthens hair roots",
      "Stimulates dormant hair follicles to promote hair density",
      "Reduces hair fall, split ends, and adds natural dark shine"
    ],
    ingredients: [
      {
        name: "Bhringraj (King of Hair)",
        source: "Herbal Orchards",
        benefit: "Follicle Activation",
        desc: "Traditionally called the ruler of hair health, Bhringraj stimulates dormant roots, improving hair thickness and texture from the root up.",
        img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "Amla (Indian Gooseberry)",
        source: "Organic Plantations",
        benefit: "Melanin Protection",
        desc: "Rich in active Vitamin C and natural tannins, Amla deeply conditions dry strands, prevents premature graying, and seals natural shine.",
        img: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=400&auto=format&fit=crop"
      }
    ],
    usage: [
      "Warm 1-2 tablespoons of Keshvedaam Hair Oil in your palms.",
      "Gently massage into the scalp using circular fingertip motions.",
      "Apply the remaining oil along the hair strands to the tips.",
      "Leave it on for at least 2 hours, or overnight, before washing."
    ],
    highlights: ["Copper Pot Brewed", "Zero Mineral Oil Base", "Traditional Kshirpak Process", "Controls Static Frizz"],
    reviews: [
      {
        author: "Rohini S.",
        rating: 5,
        text: "Keshvedaam is the only oil that has successfully controlled my seasonal hair fall. Within 3 weeks, my scalp feels moisturized and I see so many new baby hairs growing at my temples!",
        date: "May 10, 2026",
        tag: "Verified Collector"
      }
    ],
    faqs: [
      {
        q: "How does copper vessel preparation help?",
        a: "Brewing herbs in copper pots releases trace elements of copper, which are natural antimicrobials. This purifies the oil and helps strengthen the protein bonds in hair cuticles."
      }
    ]
  },
  {
    id: "keshvedaam-200",
    name: "Keshvedaam Hair Oil (200ml)",
    price: 380,
    originalPrice: 480,
    discount: "20% OFF",
    tag: "Best Value",
    images: [
      "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519735777090-ec97162ec268?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544367567-0f2fcb046eb9?q=80&w=800&auto=format&fit=crop"
    ],
    category: "hair-oil",
    tagline: "Double size Keshvedaam copper-cured oil for complete family scalp care.",
    rating: 4.9,
    ratingCount: 122,
    desc: "Double the quantity of our copper-cured nourishing hair nectar, designed for complete family scalp wellness.",
    longDesc: "Get double the volume of our signature Kshirpak-infused Keshvedaam Hair Oil. Formulated with fresh bhringraj, organic coconut oil, and wild sesame bases to nourish the scalp, soothe heat, and prevent dry, flaky buildup across all age groups.",
    benefits: [
      "Prevents scalp dryness and white, flaky dandruff buildup",
      "Soothes scalp heat, stress, and follicle inflammation",
      "Locks in moisture at the hair shaft for long-term hydration"
    ],
    ingredients: [
      {
        name: "Bhringraj (King of Hair)",
        source: "Herbal Orchards",
        benefit: "Follicle Activation",
        desc: "Stimulates micro-circulation in the scalp to awaken dormant hair roots and promote dense strand development.",
        img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "Cold-Pressed Sesame Oil",
        source: "Organic Dry Fields",
        benefit: "Scalp Nourishment",
        desc: "A nutrient-dense base rich in vitamins E and B complex, plus minerals like calcium and magnesium that strengthen follicles.",
        img: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400&auto=format&fit=crop"
      }
    ],
    usage: [
      "Take an adequate amount of oil in a small bowl.",
      "Massage thoroughly into the scalp for 10-15 minutes (Champi).",
      "Wrap hair in a warm damp towel for 20 minutes for deeper penetration.",
      "Wash off with a mild organic shampoo."
    ],
    highlights: ["Complete Family Pack", "Hand-Pressed Botanical Base", "100% Preservative Free", "Traditional Champi Oil"],
    reviews: [
      {
        author: "Vikram P.",
        rating: 5,
        text: "I love that this oil does not contain mineral base oils. It washes out easily without leaving any sticky residue. My hair feels incredibly soft, smooth, and smells naturally of Ayurvedic herbs.",
        date: "May 14, 2026",
        tag: "Verified Collector"
      }
    ],
    faqs: [
      {
        q: "Can I use this oil daily?",
        a: "Yes, you can apply a few drops daily to the ends to lock in moisture, but for a full scalp treatment, massaging 2-3 times a week before washing is recommended."
      }
    ]
  },
  {
    id: "scalp-revival-set",
    name: "Scalp Revival Ritual Set",
    price: 490,
    originalPrice: 650,
    discount: "24% OFF",
    tag: "Gift & Wellness Pack",
    images: [
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519735777090-ec97162ec268?q=80&w=800&auto=format&fit=crop"
    ],
    category: "hair-oil",
    tagline: "The ultimate Ayurvedic scalp care set with wood-carved neem comb.",
    rating: 4.8,
    ratingCount: 74,
    desc: "The ultimate scalp care ritual pack including Keshvedaam Oil (100ml), a handcrafted neem wood comb, and a nourishing hair pack.",
    longDesc: "Elevate hair care into a calming wellness ritual. This set combines our copper-infused Keshvedaam Hair Oil (100ml) with a hand-carved, antibacterial Neem wood comb and a strengthening herbal hair pack. Designed to stimulate scalp circulation and balance sebum.",
    benefits: [
      "Improves blood circulation in the scalp via neem-wood combing",
      "Neem wood comb controls static frizz, hair breakage, and dandruff",
      "Herbal hair pack strengthens cuticles and conditions strands"
    ],
    ingredients: [
      {
        name: "Bhringraj & Amla Oil",
        source: "Keshvedaam Apothecary",
        benefit: "Follicle Nourishment",
        desc: "Copper-pot brewed active infusion that prevents hair thinning and nourishes hair shafts.",
        img: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "Medicinal Neem Wood",
        source: "Artisan Wood Carvers",
        benefit: "Scalp Detox & De-frizz",
        desc: "Neem wood combs distribute natural scalp oils down the hair shaft, neutralizing static and preventing scalp infections.",
        img: "https://images.unsplash.com/photo-1519735777090-ec97162ec268?q=80&w=400&auto=format&fit=crop"
      }
    ],
    usage: [
      "Apply Keshvedaam Oil generously onto the scalp.",
      "Use the hand-carved Neem Wood Comb to gently comb hair from roots to tips, detangling frizz.",
      "Mix the herbal hair pack with water, apply as a hair mask, and leave for 20 minutes.",
      "Rinse with lukewarm water."
    ],
    highlights: ["Handcrafted Neem Comb", "Complete Scalp Detox", "Ideal Luxury Gift Set", "Eco-friendly Packaging"],
    reviews: [
      {
        author: "Shalini V.",
        rating: 5,
        text: "Buying the Scalp Revival Set was so worth it. The neem wood comb is a game changer for static frizz after showers. The oil feels luxury and cured. Highly recommend Hridhay Connect!",
        date: "May 19, 2026",
        tag: "Verified Collector"
      }
    ],
    faqs: [
      {
        q: "Why is a Neem Wood comb better than plastic?",
        a: "Plastic combs create static electricity, which weakens hair roots and causes breakage. Neem wood combs are static-free, have rounded teeth that massage the scalp, and naturally release anti-fungal neem extracts."
      }
    ]
  },

  // 3. Mukhwas
  {
    id: "dil-ranjan",
    name: "Dil Ranjan Mukhwas (150g Jar)",
    price: 80,
    originalPrice: 140,
    discount: "42% OFF",
    tag: "Best Seller",
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1628134789524-118835f8ec78?q=80&w=800&auto=format&fit=crop"
    ],
    category: "mukhwas",
    tagline: "Wood-roasted fennel, sesame, and coriander seeds for post-meal stomach comfort.",
    rating: 4.8,
    ratingCount: 184,
    desc: "Our royal heritage digestive blend, slow-roasted over mild wood fire with fennel, sesame, coriander pulses, and spices.",
    longDesc: "In Indian homes, the after-meal digestive is a deeply rooted cultural symbol of hospitality, sharing, and stomach comfort. At Hridhay Connect, we prepare our mukhwas following authentic, wood-roasted recipes. We completely omit synthetic food coloring, chemical glazes, and cheap artificial sweeteners.",
    benefits: [
      "Aids post-meal stomach comfort and bloating relief",
      "Rich in digestion-enhancing fibers and minerals",
      "100% natural, sugar-saccharin free mouth freshener"
    ],
    ingredients: [
      {
        name: "Roasted Fennel (Saunf)",
        source: "Heritage Spice Farms",
        benefit: "Acidity Relief",
        desc: "Gently wood-roasted saunf contains active estragole and anethole, essential oils that relax intestinal muscles to prevent bloating.",
        img: "https://images.unsplash.com/photo-1628134789524-118835f8ec78?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "Coriander Pulses (Dhana Dal)",
        source: "Organic Dry Fields",
        benefit: "Cooling & Fiber",
        desc: "Supplies dietary fiber and essential minerals that cool the stomach tract and neutralize excessive post-meal acids.",
        img: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=400&auto=format&fit=crop"
      }
    ],
    usage: [
      "Take 1/2 to 1 teaspoon of Dil Ranjan Mukhwas after a meal.",
      "Chew slowly to allow the active digestive oils of fennel to mix with saliva.",
      "Enjoy the heritage roasted aroma as it freshens your palate."
    ],
    highlights: ["Wood-Roasted Process", "Zero Chemical Colors", "100% Saccharin Free", "Airtight Glass Packaging"],
    reviews: [
      {
        author: "Radhika M.",
        rating: 5,
        text: "Dil Ranjan Mukhwas has become a mandatory post-lunch ritual in our house. It is so crunchy, roasted perfectly, and does not have that chemical sweetness of restaurant mukhwas. Love the raw cardamom hit!",
        date: "May 24, 2026",
        tag: "Verified Collector"
      }
    ],
    faqs: [
      {
        q: "What makes this different from regular mouth fresheners?",
        a: "Most commercial mukhwas are glazed with petroleum waxes, colored with synthetic dyes, and sweetened with chemical saccharin. Hridhay Connect mukhwas are dry-roasted with no wax, organic spices, and natural sweeteners."
      }
    ]
  },
  {
    id: "kalkatti-pan",
    name: "Kalkatti Pan Mukhwas (150g Jar)",
    price: 90,
    originalPrice: 160,
    discount: "43% OFF",
    tag: "Traditional Favorite",
    images: [
      "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550950158-d0d960dff51b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=800&auto=format&fit=crop"
    ],
    category: "mukhwas",
    tagline: "Calcutta betel leaf inspired blend cured with sun-cooked Damascus rose gulkand.",
    rating: 4.9,
    ratingCount: 154,
    desc: "An organic blend inspired by the heritage betel leaf of Calcutta, cured with cooling gulkand and digestive seeds.",
    longDesc: "Bring home the authentic essence of Calcutta's street pan without the health hazards. Cured in the warmth of the sun with real Damascus rose petals (gulkand), cooling betel leaves, fennel seeds, and dates, this digestive cools stomach heat and freshens breath naturally.",
    benefits: [
      "Cools internal stomach heat and neutralizes acidity",
      "Real fleshy rose petal base provides natural sweetness",
      "Refreshes bad breath with organic herbs"
    ],
    ingredients: [
      {
        name: "Damascus Rose Gulkand",
        source: "Srinagar Rose Gardens",
        benefit: "Stomach Coolant",
        desc: "Sun-cooked rose petals cured with mishri rock sugar, acting as a powerful traditional coolant for acidity and stomach heat.",
        img: "https://images.unsplash.com/photo-1550950158-d0d960dff51b?q=80&w=400&auto=format&fit=crop"
      }
    ],
    usage: [
      "Serve a teaspoon of Kalkatti Pan Mukhwas after heavy dinners.",
      "Chew thoroughly to enjoy the sweet, minty, and cooling betel leaf nectars."
    ],
    highlights: ["Sun-Cured Gulkand", "100% Betel Leaf Infused", "Zero Artificial Glazes", "Cools Stomach Acidity"],
    reviews: [
      {
        author: "Gautam K.",
        rating: 5,
        text: "The Kalkatti Pan is amazing! It feels so cooling on the throat, and the gulkand flavor is incredibly rich. Safe to say my acidity issues after heavy dinners have completely disappeared.",
        date: "May 21, 2026",
        tag: "Verified Collector"
      }
    ],
    faqs: [
      {
        q: "Is it safe for diabetics?",
        a: "Yes, absolutely. Since it contains only natural jamun fruit pulp and organic spices (without white refined sugars), it is highly beneficial for diabetic sugar management."
      }
    ]
  },
  {
    id: "royal-cardamom-masala",
    name: "Royal Cardamom Tea Masala",
    price: 120,
    originalPrice: 200,
    discount: "40% OFF",
    tag: "Aromatic Signature",
    images: [
      "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=800&auto=format&fit=crop"
    ],
    category: "tea-masala",
    tagline: "Slow-roasted cardamoms and dry ginger root for a heritage tea aroma.",
    rating: 4.9,
    ratingCount: 215,
    desc: "A rich, slow-roasted spice blend featuring green cardamom, sun-dried ginger, cinnamon, and black pepper.",
    longDesc: "Elevate your daily tea ritual into a royal sensory experience. Hand-ground in micro-batches, our Royal Cardamom Tea Masala features the finest green cardamoms sourced from the misty hills of Munnar, combined with sun-cured ginger root and premium wood-roasted spices. Zero artificial colors, sweeteners, or preservatives.",
    benefits: [
      "Enhances digestion and reduces post-meal acidity",
      "Aids respiratory warmth and immunity support",
      "Provides an intensely comforting, heritage Indian aroma"
    ],
    ingredients: [
      {
        name: "Green Cardamom (Elaichi)",
        source: "Munnar Hill Estates",
        benefit: "Aroma & Digestion",
        desc: "Green cardamom pods loaded with active terpene oils that relax stomach muscles, alleviate gas, and refresh the palate.",
        img: "https://images.unsplash.com/photo-1628134789524-118835f8ec78?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "Sun-Dried Ginger (Saunth)",
        source: "Organic Spice Gardens",
        benefit: "Immunity & Warmth",
        desc: "Rich in gingerol compounds that provide a comforting warmth, stimulate circulation, and soothe throat irritations.",
        img: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=400&auto=format&fit=crop"
      }
    ],
    usage: [
      "Prepare your normal black tea with water and milk.",
      "Add 1/4 teaspoon of Royal Cardamom Tea Masala per cup during boiling.",
      "Let it simmer for 1-2 minutes to release the aromatic essential oils.",
      "Strain and serve warm, sweetened as desired."
    ],
    highlights: ["100% Organic Spices", "No Preservatives", "Hand-Pounded Heritage Recipe", "Airtight Glass Jar"],
    reviews: [
      {
        author: "Suresh P.",
        rating: 5,
        text: "This masala has transformed my morning chai. The cardamom hit is so fresh and powerful. Unlike store brands, you can actually see the quality of the grind. Absolute luxury!",
        date: "May 25, 2026",
        tag: "Verified Collector"
      }
    ],
    faqs: [
      {
        q: "How much masala should I use per cup?",
        a: "We recommend starting with 1/4 teaspoon per cup. You can adjust the quantity to be slightly more if you prefer a strong, spicy kick."
      }
    ]
  },
  {
    id: "shahi-kesar-masala",
    name: "Shahi Kesar Tea Masala",
    price: 180,
    originalPrice: 300,
    discount: "40% OFF",
    tag: "Luxury Collection",
    images: [
      "https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1628134789524-118835f8ec78?q=80&w=800&auto=format&fit=crop"
    ],
    category: "tea-masala",
    tagline: "Premium Kashmiri saffron threads cured with green cardamom and dry rose petals.",
    rating: 4.9,
    ratingCount: 142,
    desc: "A luxurious royal blend cured with organic Kashmiri saffron, cardamom, ginger, nutmeg, and Damascus rose petals.",
    longDesc: "Indulge in the zenith of Indian tea culture. Cured in the gentle warmth of the sun, our Shahi Kesar Tea Masala features authentic, hand-picked Kashmiri saffron threads (Kesar). We slow-infuse saffron with sweet green cardamoms, aromatic nutmeg, and sun-dried Damascus rose petals for a rich, golden, and deeply soothing tea experience.",
    benefits: [
      "Antioxidant-rich saffron supports mood enhancement",
      "Damascus rose petals cool the stomach and aid digestion",
      "Improves natural skin glow and blood circulation"
    ],
    ingredients: [
      {
        name: "Kashmiri Saffron (Kesar)",
        source: "Pampore Saffron Fields",
        benefit: "Cellular Rejuvenation",
        desc: "Hand-harvested saffron threads containing crocin that supply powerful antioxidants, boosting immunity and skin glow.",
        img: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "Damascus Rose Petals",
        source: "Srinagar Rose Orchards",
        benefit: "Palate cooling",
        desc: "Sun-dried rose petals that add a delicate floral sweetness and soothe internal stomach heat.",
        img: "https://images.unsplash.com/photo-1550950158-d0d960dff51b?q=80&w=400&auto=format&fit=crop"
      }
    ],
    usage: [
      "Boil water with tea leaves and milk.",
      "Add 1/4 teaspoon of Shahi Kesar Tea Masala per cup.",
      "Simmer on low heat for 2 minutes to let the saffron threads bleed their gold color and aroma.",
      "Strain and enjoy the royal golden elixir."
    ],
    highlights: ["Grade A Saffron Threads", "Rose Cured Blend", "Sugar & Sweetener Free", "Eco-Friendly Premium Jar"],
    reviews: [
      {
        author: "Meenakshi S.",
        rating: 5,
        text: "Unbelievable aroma! My guests are always asking what spice blend I use in the tea. The saffron strands are visible and turn the tea into a beautiful golden color. Worth every rupee.",
        date: "May 22, 2026",
        tag: "Verified Collector"
      }
    ],
    faqs: [
      {
        q: "Does this contain real saffron threads?",
        a: "Yes, absolutely. We use Grade A hand-picked saffron threads from Kashmir, which are clearly visible in the spice mixture and bleed a natural golden-yellow color when boiled."
      }
    ]
  },
  {
    id: "lemongrass-karha-masala",
    name: "Karha Lemongrass Tea Masala",
    price: 95,
    originalPrice: 160,
    discount: "40% OFF",
    tag: "Immunity Booster",
    images: [
      "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800&auto=format&fit=crop"
    ],
    category: "tea-masala",
    tagline: "Organic lemongrass, holy basil, ginger, and cloves for immune defense.",
    rating: 4.8,
    ratingCount: 98,
    desc: "A restorative wellness blend featuring organic dried lemongrass, holy basil (tulsi), cloves, and ginger.",
    longDesc: "Fortify your body's defenses with every sip. Our Karha Lemongrass Tea Masala is formulated as an Ayurvedic remedy for seasonal changes. We blend the citrusy brightness of dried lemongrass leaves with antibacterial holy basil (tulsi), warming cloves, black pepper, and ginger to create a highly refreshing wellness drink.",
    benefits: [
      "Warming cloves & ginger relieve coughs and congestion",
      "Lemongrass and tulsi support respiratory detox and defense",
      "Improves metabolism and refreshes oral hygiene naturally"
    ],
    ingredients: [
      {
        name: "Dried Lemongrass",
        source: "Ethical Herb Gardens",
        benefit: "Citrus Refreshment",
        desc: "Dried lemongrass blades that release citral oils to soothe digestive bloating, ease stress, and boost metabolism.",
        img: "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "Holy Basil (Tulsi)",
        source: "In-House Herb Farm",
        benefit: "Immune Defense",
        desc: "An adaptogenic herb known for its antibacterial and antiviral properties that clear respiratory pathways.",
        img: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=400&auto=format&fit=crop"
      }
    ],
    usage: [
      "Add 1/4 teaspoon of Lemongrass Masala to boiling water with tea leaves (with or without milk).",
      "Let it boil vigorously for 2 minutes to extract the lemongrass blades.",
      "Strain and enjoy the refreshing citrus aroma."
    ],
    highlights: ["Organic Lemongrass & Tulsi", "Seasonal Immunity Shield", "Antibacterial Actives", "Caffeine-Free Friendly"],
    reviews: [
      {
        author: "Rohan V.",
        rating: 5,
        text: "The lemongrass taste is so clear and uplifting! It gives such a fresh twist to regular black tea, and it has really helped soothe my throat scratchiness. A wellness must-have.",
        date: "May 20, 2026",
        tag: "Verified Collector"
      }
    ],
    faqs: [
      {
        q: "Can this be consumed without milk?",
        a: "Absolutely. This blend is excellent as a black herbal tea (Karha) boiled with just water, lemon, and honey, or with traditional milk-based tea."
      }
    ]
  },
  {
    id: "amethyst-revival-serum",
    name: "Amethyst Revival Serum",
    price: 1450,
    originalPrice: 1950,
    discount: "25% OFF",
    tag: "Best Seller",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1629198728070-7815cf1be5e8?q=80&w=800&auto=format&fit=crop"
    ],
    category: "hridhay-special",
    tagline: "Antioxidant rich restorative drops charged with amethyst-infused lavender.",
    rating: 4.9,
    ratingCount: 320,
    desc: "Antioxidant rich restorative face drops infused with lavender active extract and precious mineral essence.",
    longDesc: "Elevate your skin wellness with the ultimate healing nectar. Our Amethyst Revival Serum combines wild-harvested French lavender actives, cold-pressed botanicals, and high-potency skin repair antioxidants. Slow-brewed under sterile conditions and energetically aligned to restore natural balance and radiance.",
    benefits: [
      "Accelerates natural overnight cellular skin repair",
      "Deeply calms inflammation and redness from dryness",
      "Fades fine lines and boosts natural elastic glow"
    ],
    ingredients: [
      {
        name: "Wild French Lavender Active",
        source: "Provence Botanical Gardens",
        benefit: "Cellular Soothing",
        desc: "Sourced from high-altitude organic farms, this active lavender compound reduces inflammation and stimulates skin repair.",
        img: "https://images.unsplash.com/photo-1546554137-f86b9593a222?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "Vegan Squalane",
        source: "Organic Olive Pressings",
        benefit: "Elasticity & Moisture",
        desc: "A lightweight botanical lipid that mimics skin's natural sebum, sealing in deep cellular hydration without clogging pores.",
        img: "https://images.unsplash.com/photo-1607006482945-aa1a1827402c?q=80&w=400&auto=format&fit=crop"
      }
    ],
    usage: [
      "Cleanse your face and pat dry.",
      "Dispense 3-4 drops of Amethyst Revival Serum onto your fingertips.",
      "Gently press the serum into your face and neck in upward sweeps.",
      "Allow it to absorb for 1 minute before layering creams."
    ],
    highlights: ["Energetically Aligned", "Zero Synthetic Toxins", "Dermatologically Audited", "Cold-Pressed Seed Oils"],
    reviews: [
      {
        author: "Meera J.",
        rating: 5,
        text: "The absolute crown jewel of my skincare! It has completely cured my dry red patches. Smells like a premium spa, and the texture is so silky.",
        date: "May 25, 2026",
        tag: "Verified Collector"
      }
    ],
    faqs: [
      {
        q: "When should I apply this serum?",
        a: "We recommend using it in your evening skincare ritual so the active lavender and squalane can support your skin's natural overnight cellular repair."
      }
    ]
  },
  {
    id: "lavender-sleep-mask",
    name: "Lavender Sleep Mask",
    price: 1100,
    originalPrice: 1500,
    discount: "26% OFF",
    tag: "Ritual Essential",
    images: [
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1629198728070-7815cf1be5e8?q=80&w=800&auto=format&fit=crop"
    ],
    category: "hridhay-special",
    tagline: "Overnight cellular repair cream with active lavender, chamomile, and niacinamide.",
    rating: 4.8,
    ratingCount: 195,
    desc: "A rich overnight recovery mask loaded with active lavender extracts, calming chamomile, and niacinamide.",
    longDesc: "Rebuild your skin's moisture barrier while you sleep. The Lavender Sleep Mask is a luxurious, whipped treatment cream designed to lock in active hydration, reduce environmental redness, and smooth uneven textures. Formulated with skin-repairing niacinamide and organic floral distillates.",
    benefits: [
      "Fortifies the dermal moisture barrier overnight",
      "Soothes sensitive, wind-chafed, or irritated skin",
      "Provides relaxing aromatherapy for deep, restful sleep"
    ],
    ingredients: [
      {
        name: "Chamomile Blossom Distillate",
        source: "In-House Organic Gardens",
        benefit: "Anti-Redness Active",
        desc: "Contains active apigenin which provides deep comfort, instantly reducing surface irritation and skin heat.",
        img: "https://images.unsplash.com/photo-1607006482945-aa1a1827402c?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "Niacinamide (Vitamin B3)",
        source: "Clinical Clean Labs",
        benefit: "Pore & Spot Correction",
        desc: "Gently refines skin pores, regulates excess oil, and fades hyperpigmented dark spots over time.",
        img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=400&auto=format&fit=crop"
      }
    ],
    usage: [
      "Perform your full evening skincare routine.",
      "As the final step, apply an even, generous layer of the sleep mask onto your face.",
      "Gently massage and leave on overnight.",
      "Rinse with lukewarm water in the morning to reveal plump, radiant skin."
    ],
    highlights: ["Sulphate & Paraben Free", "Non-Comedogenic Cream", "100% Recyclable Glass", "Aromatherapeutic Formulation"],
    reviews: [
      {
        author: "Kavya R.",
        rating: 5,
        text: "This mask is like silk on my skin! I wake up with the softest, most hydrated face ever. The lavender aroma makes me fall asleep immediately.",
        date: "May 22, 2026",
        tag: "Verified Collector"
      }
    ],
    faqs: [
      {
        q: "Does it feel greasy or stain pillows?",
        a: "No. Our whipped sleep mask is formulated to absorb quickly, forming a dry, breathable hydrating shield that won't rub off onto your bed linens."
      }
    ]
  },
  {
    id: "plum-essence-toner",
    name: "Plum Essence Toner",
    price: 850,
    originalPrice: 1200,
    discount: "29% OFF",
    tag: "Fresh Collection",
    images: [
      "https://images.unsplash.com/photo-1629198728070-7815cf1be5e8?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop"
    ],
    category: "hridhay-special",
    tagline: "Balancing and pore-refining mist with Kakadu plum extract and wild rosewater.",
    rating: 4.7,
    ratingCount: 145,
    desc: "A balancing, pore-refining floral water mist infused with antioxidant-rich Kakadu plum and organic rose distillates.",
    longDesc: "Drench your pores in pure botanical dew. Our Plum Essence Toner utilizes Kakadu Plum—the world's richest natural source of Vitamin C—blended with pure steam-distilled Bulgarian rosewater. It instantly restores pH balance, tightens pores, and preps the skin to absorb active serums.",
    benefits: [
      "Instantly tightens pores and balances skin pH levels",
      "Supplies active Vitamin C to brighten dull complexions",
      "Provides lightweight, cooling botanical hydration throughout the day"
    ],
    ingredients: [
      {
        name: "Kakadu Plum Active",
        source: "Northern Territory Cooperatives",
        benefit: "Vitamin C Brightening",
        desc: "A powerful superfruit active that neutralizes environmental free radicals and fades dark spots.",
        img: "https://images.unsplash.com/photo-1590483736622-39da8af75bba?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "Steam-Distilled Rosewater",
        source: "Kazanlak Valley Gardens",
        benefit: "Toning & Pore Balancing",
        desc: "A heritage skin soothing mist that tempers inflammation and refines skin's micro-texture.",
        img: "https://images.unsplash.com/photo-1550950158-d0d960dff51b?q=80&w=400&auto=format&fit=crop"
      }
    ],
    usage: [
      "Hold the mist bottle 8-10 inches away from your face.",
      "Spray 3-4 pumps evenly across your face and neck.",
      "Gently pat with your palms to facilitate absorption.",
      "Use morning, night, or throughout the day for an instant refreshing boost."
    ],
    highlights: ["Rich in Vitamin C", "Alcohol Free Toning", "Fine Mist Spray", "pH Balancing Approved"],
    reviews: [
      {
        author: "Nikhil S.",
        rating: 4.8,
        text: "The mist is so fine and feels incredibly refreshing. I spray it mid-day at my desk, and it instantly brightens my tired face. The scent of rose and plum is amazing.",
        date: "May 18, 2026",
        tag: "Verified Collector"
      }
    ],
    faqs: [
      {
        q: "Can I use it over makeup?",
        a: "Yes. Our fine mist spray is designed to refresh your skin without disturbing your makeup or sunscreens."
      }
    ]
  }
];

// Function to update the in-memory products array with live API data
export function syncProducts(fetchedProducts: Product[]) {
  fetchedProducts.forEach(fetched => {
    const existingIdx = products.findIndex(p => p.id === fetched.id);
    if (existingIdx !== -1) {
      // Mutate in-place to preserve references across files
      products[existingIdx] = {
        ...products[existingIdx],
        ...fetched,
        // Preserve any sub-arrays/objects if API didn't return them
        images: fetched.images && fetched.images.length > 0 ? fetched.images : products[existingIdx].images,
        benefits: fetched.benefits && fetched.benefits.length > 0 ? fetched.benefits : products[existingIdx].benefits,
        ingredients: fetched.ingredients && fetched.ingredients.length > 0 ? fetched.ingredients : products[existingIdx].ingredients,
        usage: fetched.usage && fetched.usage.length > 0 ? fetched.usage : products[existingIdx].usage,
        highlights: fetched.highlights && fetched.highlights.length > 0 ? fetched.highlights : products[existingIdx].highlights,
        reviews: fetched.reviews && fetched.reviews.length > 0 ? fetched.reviews : products[existingIdx].reviews,
        faqs: fetched.faqs && fetched.faqs.length > 0 ? fetched.faqs : products[existingIdx].faqs,
      };
    } else {
      // Add new product from API
      products.push(fetched);
    }
  });
}
