import { useState, useEffect } from "react";
import { Navigation } from "./components/Navigation";
import { HeroSection } from "./components/HeroSection";
import { CategoryCarousel } from "./components/CategoryCarousel";
import {
  TopCategories,
  TrendingProducts,
  NewArrivals,
  FeaturedProducts,
  BestSellers,
  OnSaleProducts
} from "./components/DynamicHomeSections";
import { Marquee } from "./components/Marquee";
import { BrandStory } from "./components/BrandStory";
import { Ingredients } from "./components/Ingredients";
import { FeaturedCollection } from "./components/FeaturedCollection";
import { WellnessExperience } from "./components/WellnessExperience";
import { InteractiveScroll } from "./components/InteractiveScroll";
import { Testimonials } from "./components/Testimonials";
import { TrustBadges } from "./components/TrustBadges";
import { Footer } from "./components/Footer";
import { InstagramSection } from "./components/InstagramSection";
import { HomepageImageShowcase } from "./components/HomepageImageShowcase";
import { AboutPage } from "./components/AboutPage";
import { SoapCategoryPage } from "./components/SoapCategoryPage";
import { HairOilCategoryPage } from "./components/HairOilCategoryPage";
import { MukhwasCategoryPage } from "./components/MukhwasCategoryPage";
import { TeaMasalaCategoryPage } from "./components/TeaMasalaCategoryPage";
import { HridhaySpecialCategoryPage } from "./components/HridhaySpecialCategoryPage";
import { ProductPage } from "./components/ProductPage";
import { CartPage } from "./components/CartPage";
import { CheckoutPage } from "./components/CheckoutPage";
import { MiniCartDrawer } from "./components/MiniCartDrawer";
import { LoadingScreen } from "./components/LoadingScreen";
import { SignUpModal } from "./components/SignUpModal";
import { useSignUp } from "./context/SignUpContext";
import { products } from "./data/products";
import { FloatingWhatsApp } from "./components/FloatingWhatsApp";

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'soap' | 'hair-oil' | 'mukhwas' | 'tea-masala' | 'hridhay-special' | 'product' | 'cart' | 'checkout'>('home');
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

      {currentPage === 'home' ? (
        <>
          <HeroSection />
          <Marquee />
          <CategoryCarousel />
          <TopCategories />
          <TrendingProducts />
          <NewArrivals />
          <FeaturedProducts />
          <BestSellers />
          <OnSaleProducts />

          <BrandStory />
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
      ) : null}

      <Footer />

      <MiniCartDrawer />

      {/* Premium Sign Up Modal */}
      <SignUpModal isOpen={isSignUpOpen} onClose={closeSignUp} />

      <FloatingWhatsApp />
    </div>
  );
}
