# Dynamic Pricing with SellPrice, Price & DiscountPercent

## Background

Currently, the product pricing is **static** — hardcoded `price`, `originalPrice`, and `discount` strings. The API returns dynamic pricing fields (`Price`, `SellPrice`, `DiscountPercent`, `IsPercentagePricing`) but these are not being extracted or used.

### Pricing Display Rules:
1. **If `Price == SellPrice`** → Show only `SellPrice` (no discount label, no strikethrough)
2. **If `DiscountPercent > 0`** → Show both prices (`Price` as strikethrough, `SellPrice` as main) + discount badge
3. **If `DiscountPercent == 0` but `Price != SellPrice`** → Show both prices but **NO** badge

### Affected Areas:
- Category listing pages (Soap, Mukhwas, Hair Oil, Tea Masala, Hridhay Special)
- Home page product sections (via GetHomeComponent API → table3 data)
- Product detail page (ProductPage.tsx)
- Carousel components (SectionCarousel.tsx, CategoryCarousel.tsx)
