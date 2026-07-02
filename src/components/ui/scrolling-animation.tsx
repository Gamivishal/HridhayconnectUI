"use client"

import { useEffect, useRef, useState } from "react"
import { useScroll } from "motion/react"

export function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  })

  const [progress, setProgress] = useState(0)
  const [maxRadius, setMaxRadius] = useState(280)

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setProgress(latest)
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setMaxRadius(120)
      } else if (window.innerWidth < 1024) {
        setMaxRadius(180)
      } else {
        setMaxRadius(280)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Map progress (0 to 1) dynamically to animation timelines.
  // The sticky phase is compact to prevent extra empty scrolling space.
  const animationProgress = Math.min(progress / 0.85, 1)
  const expandRadius = animationProgress * maxRadius

  // Dynamic opacities driven directly by scroll position for fluid transitions
  const textOpacity = Math.max(0, Math.min((progress - 0.3) / 0.5, 1))
  const innerBorderOpacity = Math.max(0, Math.min((progress - 0.1) / 0.5, 0.15))
  const outerBorderOpacity = Math.max(0, Math.min((progress - 0.2) / 0.55, 0.1))

  return (
    <div ref={containerRef} className="min-h-[120vh] bg-[var(--color-background)] text-[var(--color-dark-text)] relative overflow-hidden">
      
      <div className="h-screen flex items-center justify-center p-4 sm:p-8 sticky top-0 overflow-hidden">
        <div className="relative">
          {/* Outer circle border, fading in with a soft brand purple hue */}
          <div
            className="w-[260px] h-[260px] sm:w-[460px] sm:h-[460px] md:w-[600px] md:h-[600px] rounded-full flex items-center justify-center border-2 transition-all duration-300"
            style={{ borderColor: `rgba(91, 42, 134, ${outerBorderOpacity})` }}
          >
            {/* Inner circle border, fading in with secondary purple hue */}
            <div
              className="w-[210px] h-[210px] sm:w-[380px] sm:h-[380px] md:w-[500px] md:h-[500px] rounded-full flex items-center justify-center relative border-2 transition-all duration-300"
              style={{ borderColor: `rgba(122, 73, 165, ${innerBorderOpacity})` }}
            >
              {/* Gradient ring */}
              <div className="w-[160px] h-[160px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] rounded-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-secondary)] p-0.5 flex items-center justify-center relative shadow-xl">
                <div className="w-full h-full rounded-full bg-[var(--color-background)] flex items-center justify-center relative">
                  
                  {/* Expanding Profile Cards */}
                  <div
                    className="absolute w-10 h-10 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg sm:rounded-2xl overflow-hidden border border-white sm:border-4 shadow-md sm:shadow-lg transition-transform duration-300 ease-out z-0"
                    style={{
                      transform: `translate(${expandRadius * Math.cos(0)}px, ${expandRadius * Math.sin(0)}px)`,
                    }}
                  >
                      <img
                      loading="lazy"
                      decoding="async"
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
                      alt="Profile 1"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div
                    className="absolute w-10 h-10 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg sm:rounded-2xl overflow-hidden border border-white sm:border-4 shadow-md sm:shadow-lg transition-transform duration-300 ease-out z-0"
                    style={{
                      transform: `translate(${expandRadius * Math.cos(Math.PI / 4)}px, ${expandRadius * Math.sin(Math.PI / 4)}px)`,
                    }}
                  >
                      <img
                      loading="lazy"
                      decoding="async"
                      src="https://images.unsplash.com/photo-1610652492500-ded49ceeb378?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
                      alt="Profile 2"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div
                    className="absolute w-10 h-10 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg sm:rounded-2xl overflow-hidden border border-white sm:border-4 shadow-md sm:shadow-lg transition-transform duration-300 ease-out z-0"
                    style={{
                      transform: `translate(${expandRadius * Math.cos(Math.PI / 2)}px, ${expandRadius * Math.sin(Math.PI / 2)}px)`,
                    }}
                  >
                      <img
                      loading="lazy"
                      decoding="async"
                      src="https://images.unsplash.com/photo-1619365734050-cb5e64a42d43?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
                      alt="Profile 3"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div
                    className="absolute w-10 h-10 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg sm:rounded-2xl overflow-hidden border border-white sm:border-4 shadow-md sm:shadow-lg transition-transform duration-300 ease-out z-0"
                    style={{
                      transform: `translate(${expandRadius * Math.cos((3 * Math.PI) / 4)}px, ${expandRadius * Math.sin((3 * Math.PI) / 4)}px)`,
                    }}
                  >
                      <img
                      loading="lazy"
                      decoding="async"
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
                      alt="Profile 4"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div
                    className="absolute w-10 h-10 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg sm:rounded-2xl overflow-hidden border border-white sm:border-4 shadow-md sm:shadow-lg transition-transform duration-300 ease-out z-0"
                    style={{
                      transform: `translate(${expandRadius * Math.cos(Math.PI)}px, ${expandRadius * Math.sin(Math.PI)}px)`,
                    }}
                  >
                      <img
                      loading="lazy"
                      decoding="async"
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
                      alt="Profile 5"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div
                    className="absolute w-10 h-10 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg sm:rounded-2xl overflow-hidden border border-white sm:border-4 shadow-md sm:shadow-lg transition-transform duration-300 ease-out z-0"
                    style={{
                      transform: `translate(${expandRadius * Math.cos((5 * Math.PI) / 4)}px, ${expandRadius * Math.sin((5 * Math.PI) / 4)}px)`,
                    }}
                  >
                      <img
                      loading="lazy"
                      decoding="async"
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
                      alt="Profile 6"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div
                    className="absolute w-10 h-10 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg sm:rounded-2xl overflow-hidden border border-white sm:border-4 shadow-md sm:shadow-lg transition-transform duration-300 ease-out z-0"
                    style={{
                      transform: `translate(${expandRadius * Math.cos((3 * Math.PI) / 2)}px, ${expandRadius * Math.sin((3 * Math.PI) / 2)}px)`,
                    }}
                  >
                      <img
                      loading="lazy"
                      decoding="async"
                      src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
                      alt="Profile 7"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div
                    className="absolute w-10 h-10 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg sm:rounded-2xl overflow-hidden border border-white sm:border-4 shadow-md sm:shadow-lg transition-transform duration-300 ease-out z-0"
                    style={{
                      transform: `translate(${expandRadius * Math.cos((7 * Math.PI) / 4)}px, ${expandRadius * Math.sin((7 * Math.PI) / 4)}px)`,
                    }}
                  >
                      <img
                      loading="lazy"
                      decoding="async"
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
                      alt="Profile 8"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Centered Content, styled dynamically for contrast on cream */}
                  <div
                    className="flex flex-col items-center justify-center relative z-20 transition-opacity duration-300 px-4"
                    style={{ opacity: textOpacity }}
                  >
                    <h1 className="text-base sm:text-2xl md:text-4xl font-bold text-[var(--color-dark-text)] text-center mb-0.5 sm:mb-2">Empowering</h1>
                    <h1 className="text-base sm:text-2xl md:text-4xl font-bold text-[var(--color-dark-text)] text-center mb-1 sm:mb-4">Every User</h1>

                    <p className="text-[var(--color-dark-text)]/70 text-center text-[10px] sm:text-xs md:text-sm max-w-[110px] sm:max-w-xs leading-relaxed">
                      From entrepreneurs to educators, Gen AI provides tools to simplify work.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
