# Tasks - API Integration Refocus & Mukhwas category

- [x] Revert `HairOilCategoryPage.tsx` to static rendering
- [x] Revert `MukhwasCategoryPage.tsx` to static rendering
- [x] Revert `TeaMasalaCategoryPage.tsx` to static rendering
- [x] Revert `HridhaySpecialCategoryPage.tsx` to static rendering
- [x] Restrict `ProductPage.tsx` live API sync to only 'soap' category
- [x] Modify `SoapCategoryPage.tsx` to:
  - Fetch soap products from `Product/GetAll` (POST request with category 15)
  - Display raw JSON response in `console.log` on success
  - Display error in `console.error` on failure
  - Preserve `staticSoaps` data structure as base
  - Merge API results with `staticSoaps` matching on normalized name/SKU
  - Overwrite only `img` (from `ImagePath`), `price` (from `Price`), and `desc` (from `ProductDescription`)
  - Show custom Sparkle loading spinner while fetching, and prevent grid render until completion
- [x] Verify that the project compiles cleanly

## Dynamic Mukhwas Category Page & Variants Curation
- [x] Update `Product` and `ProductVariant` interfaces in `products.ts`
- [x] Modify `productService.ts` to group API results by ProductId and collect variants
- [x] Modify `MukhwasCategoryPage.tsx` to group dynamic products and show "Available only: {stock}" if stock is under 10
- [x] Modify `ProductPage.tsx` to display variant selection pills and low stock warnings
- [x] Verify compilation and functionality## Cart Synchronization Fixes
- [x] Save CustomerId and profile to localStorage upon successful login
- [x] Parse JWT token dynamically as fallback if only authToken exists
- [x] Send CustomerId in POST request with only body parameters { "Id": customerId, "Search": "" } and remove GET completely
- [x] Ensure variant matching logic handles number-to-string checks robustly
- [x] Add console logs for debugging the resolved cart items

## Cart API Mutation Fixes
- [x] Attach productId and variantId optional fields to Product interface in products.ts
- [x] Save backend productId and variantId on mapped products in productService.ts and SoapCategoryPage.tsx
- [x] Include variantId in productToAdd objects inside handleAddToCart/handleBuyNow in ProductPage.tsx
- [x] Implement saveCartItemToApi in CartContext.tsx calling `/api/Cart/SaveCart` with customerId, productId, variantId, and relative quantity change
- [x] Modify addToCart, removeFromCart, and updateQuantity to use saveCartItemToApi when logged in, falling back to local storage
- [x] Resolve and normalize ImagePath from the SaveCart response data array in resolveCartItem

## Cart Quantity Lock and Variant Identification Fixes
- [x] Implement a React Ref (`isSyncingRef`) to synchronously lock concurrent/double clicks to the quantity buttons.
- [x] Create a unified helper (`getProductAndVariantIds`) in `CartContext.tsx` to resolve product and variant IDs.
- [x] Handle parsed productId and variantId values in `resolveCartItem` with high robustness, treating `0`, null, and empty objects as falsy.
- [x] Verify buttons are disabled visually and functionally during active loading states in `CartPage.tsx` and `MiniCartDrawer.tsx`.
- [x] Disable minus button when quantity is 1 in `CartPage.tsx`, `MiniCartDrawer.tsx`, and `ProductPage.tsx`.
- [x] Redirect item removal to the dedicated `/api/Cart/RemoveCart` endpoint when clicking the Remove/Trash icon.
- [x] Fetch Tea Masala products dynamically using `fetchProductsFromApi` with category ID `18`, including sparkle spinner and low stock alerts.
- [x] Prevent changing or updating the active product gallery image or resolved cart item image when selecting a variant.

## Product Listing Price Range (Min-Max) Feature
- [x] Implement dynamic price formatting `renderPrice()` in `SoapCategoryPage.tsx` and fix duplicate useScroll syntax
- [x] Implement dynamic price formatting `renderPrice()` in `MukhwasCategoryPage.tsx`
- [x] Implement dynamic price formatting `renderPrice()` in `TeaMasalaCategoryPage.tsx`
- [x] Implement dynamic price formatting `renderPrice()` in `HairOilCategoryPage.tsx`
- [x] Implement dynamic price formatting `renderPrice()` and mount-time variant enrichment in `HridhaySpecialCategoryPage.tsx`
