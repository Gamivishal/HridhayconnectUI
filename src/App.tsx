import { useState, useEffect, lazy, Suspense } from "react";
import { Navigation } from "./components/Navigation";
import { HeroSection } from "./components/HeroSection";
import { Marquee } from "./components/Marquee";
import { MiniCartDrawer } from "./components/MiniCartDrawer";
import { LoadingScreen } from "./components/LoadingScreen";
import { SignUpModal } from "./components/SignUpModal";

// Lazy Loaded Components
const CategoryCarousel = lazy(() => import("./components/CategoryCarousel").then(m => ({ default: m.CategoryCarousel })));
const TopCategories = lazy(() => import("./components/DynamicHomeSections").then(m => ({ default: m.TopCategories })));
const TrendingProducts = lazy(() => import("./components/DynamicHomeSections").then(m => ({ default: m.TrendingProducts })));
const NewArrivals = lazy(() => import("./components/DynamicHomeSections").then(m => ({ default: m.NewArrivals })));
const FeaturedProducts = lazy(() => import("./components/DynamicHomeSections").then(m => ({ default: m.FeaturedProducts })));
const BestSellers = lazy(() => import("./components/DynamicHomeSections").then(m => ({ default: m.BestSellers })));
const OnSaleProducts = lazy(() => import("./components/DynamicHomeSections").then(m => ({ default: m.OnSaleProducts })));
const BrandStory = lazy(() => import("./components/BrandStory").then(m => ({ default: m.BrandStory })));
const BrandStatistics = lazy(() => import("./components/BrandStatistics").then(m => ({ default: m.BrandStatistics })));
const Ingredients = lazy(() => import("./components/Ingredients").then(m => ({ default: m.Ingredients })));
const FeaturedCollection = lazy(() => import("./components/FeaturedCollection").then(m => ({ default: m.FeaturedCollection })));
const WellnessExperience = lazy(() => import("./components/WellnessExperience").then(m => ({ default: m.WellnessExperience })));
const InteractiveScroll = lazy(() => import("./components/InteractiveScroll").then(m => ({ default: m.InteractiveScroll })));
const Testimonials = lazy(() => import("./components/Testimonials").then(m => ({ default: m.Testimonials })));
const TrustBadges = lazy(() => import("./components/TrustBadges").then(m => ({ default: m.TrustBadges })));
const Footer = lazy(() => import("./components/Footer").then(m => ({ default: m.Footer })));
const InstagramSection = lazy(() => import("./components/InstagramSection").then(m => ({ default: m.InstagramSection })));
const HomepageImageShowcase = lazy(() => import("./components/HomepageImageShowcase").then(m => ({ default: m.HomepageImageShowcase })));

// Lazy Loaded Pages
const AboutPage = lazy(() => import("./components/AboutPage").then(m => ({ default: m.AboutPage })));
const SoapCategoryPage = lazy(() => import("./components/SoapCategoryPage").then(m => ({ default: m.SoapCategoryPage })));
const HairOilCategoryPage = lazy(() => import("./components/HairOilCategoryPage").then(m => ({ default: m.HairOilCategoryPage })));
const MukhwasCategoryPage = lazy(() => import("./components/MukhwasCategoryPage").then(m => ({ default: m.MukhwasCategoryPage })));
const TeaMasalaCategoryPage = lazy(() => import("./components/TeaMasalaCategoryPage").then(m => ({ default: m.TeaMasalaCategoryPage })));
const HridhaySpecialCategoryPage = lazy(() => import("./components/HridhaySpecialCategoryPage").then(m => ({ default: m.HridhaySpecialCategoryPage })));
const ProductPage = lazy(() => import("./components/ProductPage").then(m => ({ default: m.ProductPage })));
const CartPage = lazy(() => import("./components/CartPage").then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import("./components/CheckoutPage").then(m => ({ default: m.CheckoutPage })));
const ProfilePage = lazy(() => import("./components/ProfilePage").then(m => ({ default: m.ProfilePage })));
import { useSignUp } from "./context/SignUpContext";
import { products } from "./data/products";
import { FloatingWhatsApp } from "./components/FloatingWhatsApp";
import { GlobalToastProvider } from "./components/GlobalToastProvider";

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'soap' | 'hair-oil' | 'mukhwas' | 'tea-masala' | 'hridhay-special' | 'product' | 'cart' | 'checkout' | 'profile'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [showLoader, setShowLoader] = useState(true);
  const { isSignUpOpen, closeSignUp } = useSignUp();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;

      if (hash.startsWith("#product-")) {
        const prodId = hash.replace("#product-", "");
        setSelectedProductId(prodId);
        setCurrentPage(prev => {
          if (prev !== 'product') window.scrollTo({ top: 0, behavior: "smooth" });
          return 'product';
        });
      } else if (hash.startsWith("#about") || hash.startsWith("#/about") || hash === "#story") {
        setCurrentPage(prev => {
          if (prev !== 'about') window.scrollTo({ top: 0, behavior: "smooth" });
          return 'about';
        });
      } else if (hash.startsWith("#soap") || hash.startsWith("#/soap")) {
        setCurrentPage(prev => {
          if (prev !== 'soap') window.scrollTo({ top: 0, behavior: "smooth" });
          return 'soap';
        });
      } else if (hash.startsWith("#hair-oil") || hash.startsWith("#/hair-oil")) {
        setCurrentPage(prev => {
          if (prev !== 'hair-oil') window.scrollTo({ top: 0, behavior: "smooth" });
          return 'hair-oil';
        });
      } else if (hash.startsWith("#mukhwas") || hash.startsWith("#/mukhwas")) {
        setCurrentPage(prev => {
          if (prev !== 'mukhwas') window.scrollTo({ top: 0, behavior: "smooth" });
          return 'mukhwas';
        });
      } else if (hash.startsWith("#tea-masala") || hash.startsWith("#/tea-masala")) {
        setCurrentPage(prev => {
          if (prev !== 'tea-masala') window.scrollTo({ top: 0, behavior: "smooth" });
          return 'tea-masala';
        });
      } else if (hash.startsWith("#hridhay-special") || hash.startsWith("#/hridhay-special")) {
        setCurrentPage(prev => {
          if (prev !== 'hridhay-special') window.scrollTo({ top: 0, behavior: "smooth" });
          return 'hridhay-special';
        });
      } else if (hash.startsWith("#cart") || hash.startsWith("#/cart")) {
        setCurrentPage(prev => {
          if (prev !== 'cart') window.scrollTo({ top: 0, behavior: "smooth" });
          return 'cart';
        });
      } else if (hash.startsWith("#checkout") || hash.startsWith("#/checkout")) {
        setCurrentPage(prev => {
          if (prev !== 'checkout') window.scrollTo({ top: 0, behavior: "smooth" });
          return 'checkout';
        });
      } else if (hash.startsWith("#profile") || hash.startsWith("#/profile") || hash === "#orders" || hash === "#addresses" || hash === "#rewards") {
        setCurrentPage(prev => {
          if (prev !== 'profile') window.scrollTo({ top: 0, behavior: "smooth" });
          return 'profile';
        });
      } else if (hash === "#home" || hash === "#") {
        setCurrentPage(prev => {
          if (prev !== 'home') window.scrollTo({ top: 0, behavior: "smooth" });
          return 'home';
        });
      } else {
        // Fallback to pathname checking when no hash routing is requested
        if (path === "/about") {
          setCurrentPage(prev => {
            if (prev !== 'about') window.scrollTo({ top: 0, behavior: "smooth" });
            return 'about';
          });
        } else if (path === "/soap" || path === "/home-made-soap") {
          setCurrentPage(prev => {
            if (prev !== 'soap') window.scrollTo({ top: 0, behavior: "smooth" });
            return 'soap';
          });
        } else if (path === "/hair-oil" || path === "/homemade-hair-oil") {
          setCurrentPage(prev => {
            if (prev !== 'hair-oil') window.scrollTo({ top: 0, behavior: "smooth" });
            return 'hair-oil';
          });
        } else if (path === "/mukhwas" || path === "/homemade-mukhwas") {
          setCurrentPage(prev => {
            if (prev !== 'mukhwas') window.scrollTo({ top: 0, behavior: "smooth" });
            return 'mukhwas';
          });
        } else if (path === "/tea-masala" || path === "/homemade-tea-masala") {
          setCurrentPage(prev => {
            if (prev !== 'tea-masala') window.scrollTo({ top: 0, behavior: "smooth" });
            return 'tea-masala';
          });
        } else if (path === "/hridhay-special" || path === "/homemade-hridhay-special") {
          setCurrentPage(prev => {
            if (prev !== 'hridhay-special') window.scrollTo({ top: 0, behavior: "smooth" });
            return 'hridhay-special';
          });
        } else if (path === "/cart") {
          setCurrentPage(prev => {
            if (prev !== 'cart') window.scrollTo({ top: 0, behavior: "smooth" });
            return 'cart';
          });
        } else if (path === "/checkout" || path === "/order-checkout") {
          setCurrentPage(prev => {
            if (prev !== 'checkout') window.scrollTo({ top: 0, behavior: "smooth" });
            return 'checkout';
          });
        } else if (path === "/profile" || path === "/orders" || path === "/addresses" || path === "/rewards") {
          setCurrentPage(prev => {
            if (prev !== 'profile') window.scrollTo({ top: 0, behavior: "smooth" });
            return 'profile';
          });
        } else if (path.startsWith("/product/")) {
          const prodId = path.replace("/product/", "");
          setSelectedProductId(prodId);
          setCurrentPage(prev => {
            if (prev !== 'product') window.scrollTo({ top: 0, behavior: "smooth" });
            return 'product';
          });
        } else {
          setCurrentPage(prev => {
            if (prev !== 'home') window.scrollTo({ top: 0, behavior: "smooth" });
            return 'home';
          });
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);
    handleHashChange();

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[var(--color-cream)] text-[var(--color-dark-text)] overflow-hidden font-sans selection:bg-[var(--color-secondary)] selection:text-white">
      {/* Cinematic Loading Screen */}
      <LoadingScreen onComplete={() => setShowLoader(false)} />

      {/* Noise overlay */}
      <div className="fixed inset-0 noise-overlay z-50 mix-blend-overlay pointer-events-none"></div>

      {/* Cinematic Ambient Background (Hero area) */}
      <div className="absolute top-0 inset-x-0 h-screen z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-[var(--color-primary)]/10 blur-[120px] mix-blend-multiply opacity-60"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[var(--color-accent)]/15 blur-[100px] mix-blend-multiply opacity-50"></div>
      </div>

      <Navigation currentPage={currentPage} />

      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[var(--color-cream)]"><div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div></div>}>
        {currentPage === 'home' ? (
          <>
            <HeroSection />
            <Marquee />
            <CategoryCarousel />
            <TopCategories />
            <BrandStory />
            <TrendingProducts />
            <NewArrivals />
            <BrandStatistics />
            <FeaturedProducts />
            <BestSellers />
            <OnSaleProducts />

            <Ingredients />
            {/* <FeaturedCollection /> */}
            <InteractiveScroll />
            <WellnessExperience />
            <Testimonials />
            <TrustBadges />
            <HomepageImageShowcase />
            <InstagramSection />
          </>
        ) : currentPage === 'about' ? (
          <AboutPage />
        ) : currentPage === 'soap' ? (
          <SoapCategoryPage />
        ) : currentPage === 'hair-oil' ? (
          <HairOilCategoryPage />
        ) : currentPage === 'mukhwas' ? (
          <MukhwasCategoryPage />
        ) : currentPage === 'tea-masala' ? (
          <TeaMasalaCategoryPage />
        ) : currentPage === 'hridhay-special' ? (
          <HridhaySpecialCategoryPage />
        ) : currentPage === 'product' ? (
          <ProductPage productId={selectedProductId} onBack={() => {
            const prod = products.find(p => p.id === selectedProductId);
            if (prod) {
              window.location.hash = `#${prod.category}`;
            } else {
              window.location.hash = "#home";
            }
          }} />
        ) : currentPage === 'cart' ? (
          <CartPage />
        ) : currentPage === 'checkout' ? (
          <CheckoutPage />
        ) : currentPage === 'profile' ? (
          <ProfilePage />
        ) : null}

        <Footer />
      </Suspense>

      <MiniCartDrawer />

      {/* Premium Sign Up Modal */}
      <SignUpModal isOpen={isSignUpOpen} onClose={closeSignUp} initialMode={useSignUp().initialMode} />

      <FloatingWhatsApp />
      <GlobalToastProvider />
    </div>
  );
}
