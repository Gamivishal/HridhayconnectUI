import { useEffect, useRef } from "react";

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animationFrameId: number;

    const checkTime = () => {
      if (!video.duration) {
        animationFrameId = requestAnimationFrame(checkTime);
        return;
      }

      const time = video.currentTime;
      const duration = video.duration;

      // Fade in over 0.5s at the start
      if (time < 0.5) {
        video.style.opacity = (time / 0.5).toString();
      }
      // Fade out over 0.5s before the end
      else if (time > duration - 0.5) {
        video.style.opacity = Math.max(0, (duration - time) / 0.5).toString();
      }
      // Fully visible in between
      else {
        video.style.opacity = "1";
      }

      animationFrameId = requestAnimationFrame(checkTime);
    };

    const handleEnded = () => {
      video.style.opacity = "0";
      setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(console.error);
      }, 100);
    };

    video.addEventListener('ended', handleEnded);
    video.play().then(() => {
      animationFrameId = requestAnimationFrame(checkTime);
    }).catch(console.error);

    return () => {
      video.removeEventListener('ended', handleEnded);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[var(--color-background)]">
      {/* Background Video Layer (z-0) */}
      <div
        className="absolute z-0 overflow-hidden pointer-events-none"
        style={{ top: '300px', inset: 'auto 0 0 0' }}
      >
        <video
          ref={videoRef}
          muted
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          className="w-full h-full object-cover"
          style={{ opacity: 0, transition: 'opacity 0.1s linear' }}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
        />
        {/* Gradient overlay on video */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-background)] via-transparent to-[var(--color-background)]" />
      </div>

      {/* Hero Section content (z-10) */}
      <div
        className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center pb-40 px-6"
        style={{ paddingTop: 'calc(8rem + 48px)' }}
      >
        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl max-w-5xl font-serif font-normal leading-[1.05] tracking-[-1.5px] text-[#1B1720] animate-fade-rise">
          Awaken <span className="italic text-[var(--color-primary)] font-serif">pure</span> vitality, restore <span className="italic text-[var(--color-primary)] font-serif">your radiance.</span>
        </h1>

        {/* Description */}
        <p
          className="text-sm sm:text-base text-[#1B1720]/90 max-w-xl mt-6 leading-relaxed font-light font-satoshi animate-fade-rise-delay"
          style={{ textShadow: "0 2px 10px rgba(255, 255, 255, 0.95), 0 1px 3px rgba(255, 255, 255, 0.9)" }}
        >
          Immerse in the luxury of unharmed botanical vitality. Our handcrafted serums restore harmony and elevate your daily wellness ritual into art.
        </p>

        {/* Hero CTA Button */}
        <button
          onClick={() => {
            const el = document.getElementById("featured");
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
            } else {
              window.location.hash = "#featured";
            }
          }}
          className="rounded-full px-12 py-4.5 text-xs font-semibold uppercase tracking-[0.2em] bg-[var(--color-primary)]/80 text-white border border-white/20 backdrop-blur-md hover:bg-[var(--color-primary)] hover:scale-[1.03] transition-all duration-300 mt-10 animate-fade-rise-delay-2 shadow-lg cursor-pointer animate-pulse-slow"
        >
          Explore The Collection
        </button>
      </div>
    </main>
  );
}
