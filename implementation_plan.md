# Dynamic Category Carousel Section

## Goal
To implement a new category-filtered product carousel section at the top of the homepage (just below the Hero section). This section will fetch all products dynamically, filter them client-side instantly based on the selected category tab, and display them in a smooth, auto-playing 4-item carousel, ensuring no variant duplicates are shown.

## User Review Required
> [!IMPORTANT]
> Since there are no third-party carousel libraries installed (like Swiper), I will build a highly-performant, custom carousel using `motion/react` (Framer Motion) and native CSS which you already have installed. It will feature seamless autoplay and next/prev controls as requested. 

> [!NOTE]
> For the layout, since displaying 4 items on mobile screens would make them incredibly small, the carousel will intelligently scale down to showing 1-2 items on mobile/tablets, but will show the requested 4 items at a time on desktop screens. Does this sound good?

## Proposed Approach

1. **Data Fetching (Performance Optimized)**:
   - Client-side filtering is absolutely the fastest and best approach for your site. We will call your API endpoint `https://localhost:7103/api/Product/GetAll` with `{ "id": -2, "categoryId": 0, "search": "" }` exactly once on mount to retrieve ALL products.
   - We will use your existing `productService.ts` mapping logic, which inherently handles deduplicating variants and returning only the single base product per item.

2. **Component Architecture**:
   - Create a new component `CategoryCarousel.tsx` in `src/components`.
   - Add category tabs (`All`, `Soap`, `Hair Oil`, `Mukhwas`, `Tea Masala`, `Hridhay Special`) with `All` selected by default.
   - Filtering will apply instantly without any additional API calls.
   - Include Next/Prev buttons to slide through the products.
   - Implement an autoplay timer (e.g. 3-4 seconds per slide) that pauses when the user hovers over a product.

3. **Homepage Integration**:
   - Place this new `<CategoryCarousel />` component directly below the `<HeroSection />` in `App.tsx` so it forms the "first section" of the main content.

## Verification Plan
### Automated Verification
- Ensure the API payload sends exactly what was requested.
- Ensure only base products are rendered (no multiple variants of the same product).
### Manual Verification
- Test that clicking category tabs instantly filters the products.
- Verify the auto-play functionality works and transitions smoothly.
- Test that clicking next/prev correctly changes the viewed products.
