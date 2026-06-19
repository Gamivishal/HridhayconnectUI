import React from "react";
import { Instagram } from "lucide-react";

interface InstagramPost {
  image: string;
  link: string;
  alt: string;
}

const instagramPosts: InstagramPost[] = [
  {
    image: "/Instagram/Diegstimage.webp",
    link: "https://www.instagram.com/p/DPdJVZwk6BL/",
    alt: "Wellness Digest"
  },
  {
    image: "/Instagram/Jamun-Shot.webp",
    link: "https://www.instagram.com/p/DQwXIPcjNPt/",
    alt: "Jamun Shot"
  },
  {
    image: "/Instagram/Pan-Shot-Bottle.webp",
    link: "https://www.instagram.com/p/DSHFYavExIM/",
    alt: "Pan Shot Bottle"
  },
  {
    image: "/Instagram/mangoslicenew.png",
    link: "https://www.instagram.com/p/DWxvflHDDsH/",
    alt: "Mango Slice 100g"
  }
];

export function InstagramSection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 md:px-12 max-w-[1600px] mx-auto w-full border-t border-[var(--color-primary)]/10 bg-[var(--color-cream)] relative z-10">
      <div className="text-center mb-10 md:mb-14">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-primary)] animate-pulse" />
          <span className="text-[var(--color-primary)] font-medium tracking-[0.2em] uppercase text-xs sm:text-sm">
            Follow Us On Instagram
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[var(--color-dark-text)] leading-tight">
          See our latest products, wellness tips, & favorites
        </h2>
      </div>

      {/* Grid of Posts */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
        {instagramPosts.map((post, index) => (
          <a
            key={index}
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block relative rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[var(--color-primary)]/10 transition-all duration-700 aspect-square"
          >
            {/* Post Image */}
            <img
              src={post.image}
              alt={post.alt}
              className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
              loading="lazy"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center z-10">
              <div className="bg-white/90 p-4 rounded-full shadow-lg scale-75 group-hover:scale-100 transition-transform duration-500 ease-out text-[var(--color-primary)]">
                <Instagram className="w-6 h-6" />
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* CTA Button */}
      <div className="text-center">
        <a
          href="https://www.instagram.com/hridhayconnect/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[var(--color-primary)] text-white font-medium text-sm tracking-wider uppercase hover:bg-[var(--color-primary)]/90 hover:scale-105 shadow-md hover:shadow-xl transition-all duration-300"
        >
          <Instagram className="w-4 h-4" />
          Follow @hridhayconnect
        </a>
      </div>
    </section>
  );
}
