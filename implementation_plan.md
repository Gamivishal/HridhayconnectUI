# Hover Product Image Alternate Feature Plan

Add a hover image effect to all product cards across product sections, category pages, and related products lists. When the cursor hovers over a product card, it should transition to the secondary product image (using `images[1]` or `images?.[1]`) with a smooth cross-fade animation.

## Proposed Changes

---

### Product Card Components & Pages

#### [MODIFY] [SectionGrid.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/SectionGrid.tsx)
- Inside the product item loop:
  - Add `group-hover:opacity-0` and `transition-all duration-700 ease-out` classes to the primary image.
  - Render the alternate image `product.images[1]` absolute overlay with `opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out` classes.

#### [MODIFY] [SoapCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/SoapCategoryPage.tsx)
- **Mapping API Data**: In `loadProducts()`, populate the `images` property in the mapped soap objects (extracting all images resolved from the API's `Images` array).
- **Interface Update**: Add `images?: string[]` to the `SoapCardProps` `soap` object interface.
- **Card Rendering**:
  - Add `group-hover:opacity-0` and `transition-all duration-700 ease-out` to the primary image.
  - Render the alternate image `soap.images?.[1]` with `opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out absolute inset-0` layout.

#### [MODIFY] [HairOilCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/HairOilCategoryPage.tsx)
- **Mapping API Data**: In `loadProducts()`, populate the `images` property in the mapped oil objects.
- **Interface Update**: Add `images?: string[]` to the `HairOilCardProps` `oil` object interface.
- **Card Rendering**:
  - Add `group-hover:opacity-0` and `transition-all duration-700 ease-out` to the primary image.
  - Render the alternate image `oil.images?.[1]` absolute overlay with `opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out`.

#### [MODIFY] [MukhwasCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/MukhwasCategoryPage.tsx)
- **Mapping API Data**: In `loadProducts()`, map `images: p.images` to the card objects.
- **Card Rendering**:
  - Add `group-hover:opacity-0` and `transition-all duration-700 ease-out` to the primary image.
  - Render the alternate image `item.images?.[1]` absolute overlay with `opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out`.

#### [MODIFY] [TeaMasalaCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/TeaMasalaCategoryPage.tsx)
- **Card Rendering**:
  - Change primary image to transition scale and opacity (`group-hover:opacity-0 transition-all duration-700 ease-out`).
  - Render the alternate image `item.images?.[1]` absolute overlay with `opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out`.

#### [MODIFY] [HridhaySpecialCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/HridhaySpecialCategoryPage.tsx)
- **Card Rendering**:
  - Change primary image to transition scale and opacity (`group-hover:opacity-0 transition-all duration-700 ease-out`).
  - Render the alternate image `product.images?.[1]` absolute overlay with `opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out`.

#### [MODIFY] [ProductPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/ProductPage.tsx)
- **Related Products Card Rendering**:
  - Wrap the primary image container in a relative wrapper if needed.
  - Change primary image to fade out on hover (`group-hover:opacity-0 transition-all duration-700 ease-out group-hover:scale-110`).
  - Render the alternate image `p.images?.[1]` absolute overlay with `opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out`.

---

## Verification Plan

### Automated Tests
- Run `npm run lint` (`tsc --noEmit`) to verify TypeScript compilability and check for missing fields or type mismatches.

### Manual Verification
- Verify image transition animations:
  - Go to the Home Page and hover over items in both grid lists and carousels.
  - Go to Soap Category, Hair Oil Category, Mukhwas Category, Tea Masala Category, and Hridhay Special Category pages. Hover over cards and observe smooth cross-fading to secondary images.
  - Open a Product page, scroll to "Complete Your Botanical Set" (Related Products), hover over those cards, and verify they cross-fade correctly.
