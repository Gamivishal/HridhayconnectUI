# Infinite Autoplay Carousel for Home Sections (New Arrivals, Best Sellers, etc.)

Convert `SectionCarousel` to have the same infinite-autoplay carousel layout as `CategoryCarousel`.

## User Review Required

No critical breaking changes are expected. Visual behavior on the homepage will change from a static grid to an infinite horizontal carousel for:
- Top Categories (Component 2)
- New Arrivals (Component 4)
- Best Sellers (Component 6)

## Proposed Changes

### Component: SectionCarousel

#### [MODIFY] [SectionCarousel.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/SectionCarousel.tsx)
- Replicate `framer-motion` infinite autoplay carousel logic from [CategoryCarousel.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/CategoryCarousel.tsx).
- Adjust item width based on `itemsPerView` (calculated responsively: >= 1024px: 4, >= 768px: 3, >= 640px: 2, else 1.5).
- Auto slide every 3 seconds unless hovered or dragged.
- Render both category sections and product sections in the slider seamlessly.
- Add back manual slide navigation arrows (ChevronLeft / ChevronRight).

## Verification Plan

### Manual Verification
- Run the dev server using `npm run dev` and navigate to the homepage.
- Observe "New Arrivals" and "Best Sellers" auto-sliding.
- Verify they loop infinitely without flicker/jump when wrapping around.
- Hover over them to confirm sliding pauses.
- Drag them on mobile and desktop to confirm touch/swipe works.
- Click a product/category card to ensure navigation still works if they are not dragging.
