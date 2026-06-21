import React, { useState, useEffect } from "react";
import { get } from "../api/BaseService";
import { Loader2, Award, Leaf, Heart } from "lucide-react";

export function HomepageImageShowcase() {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadImages() {
      try {
        const json: any = await get("/HomepageImage/GetAll");
        if (json.isSuccess && json.data) {
          if (isMounted) {
            setImages(json.data);
            setIsLoading(false);
          }
        } else {
          if (isMounted) setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch homepage images", err);
        if (isMounted) setIsLoading(false);
      }
    }
    loadImages();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <section className="py-12 bg-[var(--color-cream)] flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
      </section>
    );
  }

  if (images.length === 0) {
    return null; // Do not render section if no images
  }

  // Ensure we have enough items to fill the screen width before duplicating
  const minItems = 8;
  let baseImages = [...images];
  while (baseImages.length < minItems) {
    baseImages = [...baseImages, ...images];
  }

  // Duplicate exactly once to create a seamless infinite loop (0% to -50% translation)
  const loopImages = [...baseImages, ...baseImages];

  return (
    <section className="py-16 md:py-32 overflow-hidden relative z-10 bg-gradient-to-br from-[var(--color-cream)] via-[#fdfaf5] to-[var(--color-cream)]">
      {/* Ambient Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[50rem] h-[50rem] bg-[var(--color-primary)]/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] -right-[20%] w-[60rem] h-[60rem] bg-[var(--color-secondary)]/5 rounded-full blur-[150px]"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[40rem] h-[40rem] bg-[var(--color-primary)]/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative text-center mb-10 md:mb-16 z-10">
        <span className="text-[var(--color-primary)] font-medium tracking-[0.2em] uppercase text-xs sm:text-sm mb-4 inline-block">
          Our Gallery
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[var(--color-dark-text)] mb-6 leading-tight">
          A Glimpse of <span className="italic text-[var(--color-secondary)]">Excellence</span>
        </h2>
      </div>

      <div className="relative flex overflow-hidden group">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] py-8">
          {loopImages.map((src, index) => {
            // Slight rotation variation for premium look
            const rotations = ["-rotate-2", "rotate-2", "-rotate-3", "rotate-1", "rotate-3", "-rotate-1"];
            const rotation = rotations[index % rotations.length];

            return (
              <div
                key={`${src}-${index}`}
                className="shrink-0 px-3 sm:px-4 md:px-5 flex items-center justify-center cursor-pointer"
                onClick={() => {
                  // Optional click support for future use
                  console.log("Image clicked:", src);
                }}
              >
                <div
                  className={`relative w-44 h-60 sm:w-60 sm:h-80 md:w-72 md:h-96 rounded-2xl overflow-hidden shadow-sm transition-all duration-500 ease-out transform ${rotation} hover:!rotate-0 hover:scale-[1.05] hover:shadow-2xl hover:shadow-[var(--color-primary)]/30 hover:z-20 bg-white p-2 sm:p-3`}
                >
                  <img
                    src={src}
                    alt={`Showcase ${index}`}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-xl transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Highlight Strip - Minimal & Clean */}
      {/* <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-4 z-10 relative">
        <div className="border-t border-b border-[var(--color-dark-text)]/10 py-6 md:py-8 flex flex-row justify-evenly items-center">
           */}
      {/* Feature 1 */}
      {/* <div className="flex flex-col items-center group/feature px-2">
            <div className="mb-2 md:mb-3 text-[var(--color-secondary)] transition-transform duration-300 group-hover/feature:scale-110 group-hover/feature:-translate-y-1">
              <Award strokeWidth={1.5} className="w-7 h-7 sm:w-10 sm:h-10" />
            </div>
            <h3 className="text-[var(--color-dark-text)] font-semibold sm:font-bold text-[10px] sm:text-sm tracking-widest uppercase text-center max-w-[100px] sm:max-w-none leading-tight">Quality Products</h3>
          </div> */}

      {/* Feature 2 */}
      {/* <div className="flex flex-col items-center group/feature px-2">
            <div className="mb-2 md:mb-3 text-[var(--color-secondary)] transition-transform duration-300 group-hover/feature:scale-110 group-hover/feature:-translate-y-1">
              <Leaf strokeWidth={1.5} className="w-7 h-7 sm:w-10 sm:h-10" />
            </div>
            <h3 className="text-[var(--color-dark-text)] font-semibold sm:font-bold text-[10px] sm:text-sm tracking-widest uppercase text-center max-w-[100px] sm:max-w-none leading-tight">Purity First</h3>
          </div> */}

      {/* Feature 3 */}
      {/* <div className="flex flex-col items-center group/feature px-2">
            <div className="mb-2 md:mb-3 text-[var(--color-secondary)] transition-transform duration-300 group-hover/feature:scale-110 group-hover/feature:-translate-y-1">
              <Heart strokeWidth={1.5} className="w-7 h-7 sm:w-10 sm:h-10" />
            </div>
            <h3 className="text-[var(--color-dark-text)] font-semibold sm:font-bold text-[10px] sm:text-sm tracking-widest uppercase text-center max-w-[100px] sm:max-w-none leading-tight">Handmade With Heart</h3>
          </div> */}

      {/* </div>
      </div> */}
    </section>
  );
}
