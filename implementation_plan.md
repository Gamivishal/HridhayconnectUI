# Implementation Plan - Mukhwas Variants and Stock Curation

We will enhance the API product fetching to support multiple variants per product, display only one entry per product in the listing, and show variant options and low-stock warnings on the details page.

## Proposed Changes

### 1. API Product Service
#### [MODIFY] [productService.ts](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/api/productService.ts)
* Update `fetchProductsFromApi` to group API response records by `ProductId`.
* For each unique `ProductId`, collect all variant records (prices, SKUs, images, attribute values, stock levels) into a new `variants` array.
* Set the main product properties (price, description, main image) using the first variant as default, and assign the variants list to the product object.

### 2. Product Interfaces
#### [MODIFY] [products.ts](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/data/products.ts)
* Extend the `Product` interface to include optional fields:
  * `totalAvailableStock?: number`
  * `variants?: ProductVariant[]`
* Define the `ProductVariant` interface:
  ```typescript
  export interface ProductVariant {
    varientId: number;
    variantAttributeValues_Only: string;
    variantAttributes: string;
    sku: string;
    price: number;
    imagePath: string;
    totalAvailableStock: number;
  }
  ```

### 3. Mukhwas Category Page
#### [MODIFY] [MukhwasCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/MukhwasCategoryPage.tsx)
* Instead of mapping only `staticMukhwas`, map all mukhwas products returned by the API (grouped and resolved).
* In the `MukhwasCard` details block, check if `totalAvailableStock` is under 10. If so, display a red label: `"Available only: {stock}"`.
* Update `MukhwasCardProps` to reflect the new `totalAvailableStock` field.

### 4. Product Details Page
#### [MODIFY] [ProductPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/ProductPage.tsx)
* Introduce state `selectedVariant` (defaulting to the first variant if present).
* If a product has multiple variants, display a premium selector (pills) for attributes (e.g. `"100, Pouch"`, `"200, Pouch"`).
* When a variant is selected, update the active price, main image, and stock status.
* If stock is under 10, display a red warning message: `"Available only: {stock}"`.

---

## Verification Plan

### Manual Verification
* Ensure Mukhwas listing shows exactly one card per product (e.g., Chocolate Mukhwas, Dhana Dal, Digest).
* Ensure low stock (< 10) displays "Available only: {stock}" in red on the card.
* Ensure clicking into details displays weight/packaging options and updates price/image/stock on option change.
