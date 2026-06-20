import React from 'react';

const images = [
  "/Image/AboutPageImage/Slideimage1.webp",
  "/Image/AboutPageImage/Slideimage2.webp",
  "/Image/AboutPageImage/Slideimage3.webp",
  "/Image/AboutPageImage/Slideimage4.webp",
  "/Image/AboutPageImage/Slideimage5.webp",
  "/Image/AboutPageImage/Slideimage6.webp"
];

// Pre-calculate rotations for each item to ensure stable hydration
const rotations = [-6, 5, -3, 7, -5, 4];

export const AboutImageCarousel: React.FC = () => {
  // Duplicate array for seamless infinite loop
  const duplicatedImages = [...images, ...images];
  const duplicatedRotations = [...rotations, ...rotations];

  return (
    <section className="relative py-24 md:py-36 overflow-hidden bg-[var(--color-cream)] border-y border-[var(--color-primary)]/5">
      
      {/* CSS for infinite scroll with pause on hover */}
      <style>
        {`
          @keyframes infinite-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-infinite-scroll {
            animation: infinite-scroll 45s linear infinite;
          }
          .animate-infinite-scroll:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      <div className="mb-16 text-center px-6">
        <span className="text-[var(--color-primary)] font-medium tracking-[0.2em] uppercase text-xs mb-4 flex justify-center items-center gap-4">
          <span className="w-8 h-[1px] bg-[var(--color-primary)]/40"></span>
          Pure Botanical Extracts
          <span className="w-8 h-[1px] bg-[var(--color-primary)]/40"></span>
        </span>
        <h2 className="text-3xl md:text-5xl font-serif text-black font-light tracking-tight">
          Visual <span className="italic text-[var(--color-primary)]">Symphony</span>
        </h2>
      </div>

      <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_150px,_black_calc(100%-150px),transparent_100%)]">
        <div className="flex items-center w-max animate-infinite-scroll py-8">
          {duplicatedImages.map((src, idx) => (
            <div 
              key={idx}
              className="relative flex-shrink-0 mx-4 md:mx-6 lg:mx-8 w-48 h-64 md:w-64 md:h-80 lg:w-72 lg:h-[26rem] rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-transform duration-500 hover:scale-110 hover:z-10 group bg-white/50 border border-white/50"
              style={{
                transform: `rotate(${duplicatedRotations[idx]}deg)`
              }}
            >
              <img
                src={src}
                alt={`Premium aesthetic ${idx + 1}`}
                className="w-full h-full object-cover saturate-[0.85] transition-all duration-700 group-hover:saturate-100 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-text)]/10 to-transparent transition-opacity duration-500 group-hover:opacity-0" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
