# Implementation Plan - Packaging Option for Mukhwas Products

We will add a premium packaging option selection (Pouch vs. Bottle) for all products on the Mukhwas Category Page and the Product Details page (for Mukhwas category). The selected option will be synced dynamically to the cart (local state and API calls) via a new `packingType` parameter, ensuring consistent checkout selections.

## Proposed Changes

### 1. Cart Context and State Management
#### [MODIFY] [CartContext.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/context/CartContext.tsx)
* Extend the `CartItem` interface to include an optional `packingType?: string` field.
* Update `resolveCartItem` to retrieve `packingType` case-insensitively from the API response (e.g. mapping `apiCartItem.packingType` or `apiCartItem.PackingType`).
* Update `addToCart` to accept an optional `packingType?: string` argument.
* Update `saveCartItemToApi` and `removeCartItemFromApi` to accept and send `packingType` inside the POST/DELETE payload under the key `"packingType"`.
* Update the guest cart localStorage fallback to merge items with matching `id` AND matching `packingType`, treating different packaging types as separate line items.

---

### 2. Mukhwas Category Page UI
#### [MODIFY] [MukhwasCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/MukhwasCategoryPage.tsx)
* Introduce state `packaging` (defaulting to `"Pouch"`) inside the `MukhwasCard` component.
* Add a styled dropdown selection for "Packaging" with options `"Pouch"` and `"Bottle"` inside the `MukhwasCard` details layout, stopping propagation of clicks to prevent accidental navigation.
* Pass the selected `packaging` value to `handleAddToCart` when the user clicks the "Add to Ritual" button.
* Update the page-level `handleAddToCart` function signature to receive and forward `packingType` to `addToCart`.

---

### 3. Product Details Page UI
#### [MODIFY] [ProductPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/ProductPage.tsx)
* Add a state `packaging` (defaulting to `"Pouch"`) inside `ProductPage`.
* If the active product belongs to the `"mukhwas"` category, render a premium select dropdown for "Select Packaging" with options `"Pouch"` and `"Bottle"`.
* Pass the selected `packaging` to `addToCart` during `handleAddToCart` and `prepareCheckout` during `handleBuyNow`.

---

### 4. Cart Page & Drawer UI Displays
#### [MODIFY] [CartPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/CartPage.tsx)
* If `item.packingType` is present, display it under the product name as a subtle pill/badge: `Packaging: {item.packingType}`.

#### [MODIFY] [MiniCartDrawer.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/MiniCartDrawer.tsx)
* If `item.packingType` is present, display it under the category name as a badge: `Packaging: {item.packingType}`.

#### [MODIFY] [CheckoutPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/CheckoutPage.tsx)
* If `item.packingType` is present in checkout item listings, render it under the product tagline.

---

## Verification Plan

### Manual Verification
1. Open the Mukhwas Category Page.
2. Select "Bottle" as the packaging for a mukhwas card and click "Add to Ritual".
3. Verify that the Cart Drawer slides open and displays the product name with a "Packaging: Bottle" badge.
4. Try adding the same product with "Pouch" as the packaging and check that they are added as two separate line items.
5. Proceed to Cart Page and Checkout Page to verify the chosen packaging options are displayed correctly.
6. Verify console logs for the `/Cart/SaveCart` request payload to confirm `"packingType": "Bottle"` or `"Pouch"` is sent to the server.
