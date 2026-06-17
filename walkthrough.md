# Walkthrough - Focused API Integration Complete

We have successfully refactored the application's API integration according to your specific focus areas.

Here is a summary of the changes:

## 1. Focused Soap Category Page (Home Made Shop)
* **File modified**: [SoapCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/SoapCategoryPage.tsx)
* **Changes**:
  * Added direct API fetch requesting `https://localhost:7103/api/Product/GetAll` using the `POST` method with body:
    ```json
    { "id": -2, "categoryId": 15, "search": "" }
    ```
  * Added clean console logs printing the exact request payload and raw JSON response data on success, and errors on failure.
  * Preserved the premium styled `staticSoaps` card metadata (original names, badges, benefits, and ingredients structures).
  * Merged the incoming API products with the static layout by normalized name/SKU, overwriting **ONLY** the `img` (image), `price`, and `desc` (description) fields.
  * Automatically prepended the API's base URL (`https://localhost:7103`) to any relative image paths (e.g. `/Uploads/Product/...webp`) so images render correctly from the .NET backend.
  * Defaults the image to `https://localhost:7103/Uploads/Product/no-image.png` if the API has no image path configured.
  * Added a custom Sparkle loading spinner block on mount, hiding the grid elements until the fetch has finished.
  * Integrated an in-memory sync back to the global products database so that additions to the cart or clicks to the product details page show the correct updated prices and image details.

## 2. Dynamic Image Resolution and Single Image Rendering
* **Files modified**:
  * [productService.ts](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/api/productService.ts)
  * [ProductPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/ProductPage.tsx)
* **Changes**:
  * Parsed the API's `ImagePath` in `productService.ts` to assign it to the product's `images` array (with host prefixing).
  * Automatically fall back to a default `no-image.png` path (`https://localhost:7103/Uploads/Product/no-image.png`) if the API sends no image.
  * In the product detail view, if a product contains only a single image (e.g. from the live API), we hide the thumbnail gallery block entirely and expand the main zoom box to span the full gallery width (`lg:col-span-12` instead of `10`), making the page look extremely premium.

## 3. Reverted other Category Pages to Static Curation
* **Files modified**:
  * [HairOilCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/HairOilCategoryPage.tsx)
  * [TeaMasalaCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/TeaMasalaCategoryPage.tsx)
  * [HridhaySpecialCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/HridhaySpecialCategoryPage.tsx)
* **Changes**:
  * Removed all API fetch actions, dynamic product hooks, and loading spinners.
  * All three pages now render their custom local collections immediately, keeping other categories completely static.

## 4. Product Details Page & Mukhwas Category Dynamic Updates
* **Files modified**:
  * [products.ts](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/data/products.ts)
  * [productService.ts](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/api/productService.ts)
  * [MukhwasCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/MukhwasCategoryPage.tsx)
  * [ProductPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/ProductPage.tsx)
* **Changes**:
  * **Product Variant Grouping**: Grouped raw backend flat API rows by `ProductId` inside `productService.ts` and the category page loading hooks. This keeps exactly one product record listed in the shop view, while attaching all variants to it in a new `variants` array.
  * **Red Low-Stock Alert**: Shows a warning badge `"Available only: {stock}"` in red on the Mukhwas product listing cards and details page whenever the item's `TotalAvailableStock` is strictly less than `10`.
  * **Interactive Selection Pills**: Renders options (e.g. `"100, Pouch"`, `"200, Pouch"`) on the details page. Selecting an option dynamically swaps the price, active gallery image, SKU, and stock count.
  * **Context-Aware Cart Checkout**: Adding to cart / checking out automatically formats the product name to include the selected attributes (e.g. `"Chocolate Mukhwas (200, Pouch)"`) alongside its mapped variant price and image.

## 5. Case-Insensitive API Response Parsing and Robust Mapping (Latest Fix)
* **Files modified**:
  * [productService.ts](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/api/productService.ts)
  * [SoapCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/SoapCategoryPage.tsx)
* **Changes**:
  * **Casing Robustness**: Implemented `getCaseInsensitiveProperty` and `getApiProducts` helper utilities. These extract keys from the API responses case-insensitively, supporting both PascalCase and camelCase configurations (e.g. `ProductName`/`productName`, `data`/`Data`, `table2`/`Table2`).
  * **Safe Name & SKU Matching**: Corrected matching in `SoapCategoryPage.tsx` to handle case variations and prevent incorrect matches on undefined or empty values.
  * **Prevention of blank details screens**: Solved the issue where dynamic products (like Chocolate Mukhwas or Dhana Dal) had their IDs resolve to `"undefined"` or `"null"` because of camelCase serialization on the API, resolving routing issues like `#product-dhana-dal`.

## 6. Login API Integration & Auth Token Propagation
* **Files modified**:
  * [SignUpModal.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/SignUpModal.tsx)
  * [productService.ts](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/api/productService.ts)
  * [SoapCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/SoapCategoryPage.tsx)
* **Changes**:
  * **Login Fetch Call**: Replaced the mock login submission in `SignUpModal.tsx` for `signin` mode with a real POST request to `https://localhost:7103/api/CustomerAuth/Login`.
  * **Relaxed Sign-In Validation**: Removed standard format checks for email and minimum password length when in Sign In mode, enabling users to enter credentials such as phone numbers (`9428011036`) and shorter test passwords (`vishal`) without interface validation blockages.
  * **JWT Token Extraction & Local Storage**: Automatically splits the API response's `message` property on the `|` character to retrieve the JWT token and saves it in `localStorage` as `"authToken"`.
  * **Auth Header Propagation**: Intercepted fetch requests in `productService.ts` and `SoapCategoryPage.tsx` to read the stored token and inject it as a Bearer token in the `Authorization` header (`Authorization: Bearer <token>`).

## 7. Customer Cart API Fetching & Resolution
* **Files modified**:
  * [CartContext.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/context/CartContext.tsx)
  * [CartPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/CartPage.tsx)
  * [SignUpModal.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/SignUpModal.tsx)
* **Changes**:
  * **Dynamic Cart API Sync**: Implemented `syncCartWithApi()` which queries `https://localhost:7103/api/Customer/GetAll` using the logged-in user's Bearer token. It dynamically checks for GET support and transparently falls back to a POST request if GET returns 405 (Method Not Allowed).
  * **Table3 Data Parsing**: Extracts `table3` (containing customer cart details) case-insensitively from the backend response.
  * **Product & Variant Resolution**: Mapped each cart item by checking the global in-memory product list. If it matches a `VariantId`, it correctly updates the cart item's price, title (appending variant details), and image to match that specific variant (e.g. `Weight: 200, Packaging: Pouch` variant).
  * **Graceful Placeholder Fallbacks**: If a product is not found inside the global products array, it dynamically constructs a placeholder product using the item's API properties to ensure the cart list loads smoothly without crashing.
  * **Integration Hooks**: Cart sync is automatically triggered on app startup, when visiting the Cart page, when opening the cart drawer, and immediately following a successful login.

## 8. Customer Cart Mapping & Binding Fixes (Latest Updates)
* **Files modified**:
  * [CartContext.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/context/CartContext.tsx)
  * [SignUpModal.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/SignUpModal.tsx)
  * [Navigation.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/Navigation.tsx)
* **Changes**:
  * **JWT Decoding for CustomerId**: Added a base64 JWT payload decoder `getCustomerIdFromToken` inside the cart context to extract the logged-in customer's ID dynamically from the JWT claims (e.g. `"CustomerId": "27"`).
  * **Login Response Curation**: Extended the Sign In success handler to extract the backend `data.Id` and store it as `"customerId"` in `localStorage` alongside the profile JSON.
  * **API Parameter Binding**: Updated `syncCartWithApi` to issue only a `POST` request to `/api/Customer/GetAll` with the body `{"Id": customerId, "Search": ""}` (and removed the `GET` request completely) to bind correctly on the backend.
  * **Type-Safe Variant Matching**: Replaced strict variant comparison with loose type coercion (`Number(v.varientId) === Number(variantId)`), avoiding cases where numeric string values parsed from JWT/API failed to match the typed database records.
  * **Full Session Cleanliness**: Configured the logout action to automatically purge `customerId` and `customerProfile` from local storage.
  * **Detailed Logging**: Inserted verbose logs tracing extraction results, matching keys, and fallback creation.

## 9. Dynamic Cart API Mutations
* **Files modified**:
  * [products.ts](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/data/products.ts)
  * [productService.ts](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/api/productService.ts)
  * [SoapCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/SoapCategoryPage.tsx)
  * [ProductPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/ProductPage.tsx)
  * [CartContext.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/context/CartContext.tsx)
* **Changes**:
  * **Backend Identifiers Propagation**: Attached backend `productId` and `variantId` properties to our static/dynamic product structures when loaded from the API.
  * **Relative Quantity Synchronization**: Implemented `saveCartItemToApi` in `CartContext.tsx` targeting `/api/Cart/SaveCart`. When items are added, removed, or have their quantities updated, it calculates the relative change in quantity (e.g. `+1` or `-1`) and posts it to the backend.
  * **Instant State Merging**: Captures the updated cart list returned in the API's `"data"` response block, maps its entries case-insensitively, extracts/normalizes relative image paths, and updates the local state in one atomic step.
  * **Robust Guest Mode Fallback**: Preserved local storage fallback mechanism if the user is a guest (not authenticated) or if the product does not have a database-mapped ID.

## 10. Cart Double-Click Locking and Variant Selection Fixes
* **Files modified**:
  * [CartContext.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/context/CartContext.tsx)
* **Changes**:
  * **Synchronous Lock Guard**: Added a React Ref (`isSyncingRef`) that synchronously guards the entry points of `addToCart`, `updateQuantity`, `removeFromCart`, and `syncCartWithApi`. This guarantees that double clicks or rapid multi-clicks on the minus/plus quantity buttons are intercepted and blocked on the same frame, preventing concurrent API mutations and backend race conditions.
  * **Unified ID Extractor**: Developed a helper function `getProductAndVariantIds` that robustly resolves the correct numerical product ID and variant ID from a cart item's composite ID (e.g., `"61-196"`) or its fallback list of variants. This ensures the correct variant is mutated during increment/decrement actions.
  * **High-Fidelity Resolution**: Optimized `resolveCartItem` to safely extract and parse string or numeric product and variant IDs from the backend API, correctly filtering out empty objects, nulls, and zeros as falsy/no-variant.
  * **Quantity-Based Button Disabling**: Disabled the minus (`-`) quantity adjustment button in `CartPage.tsx`, `MiniCartDrawer.tsx`, and `ProductPage.tsx` both visually (with opacity transitions and helper cursors) and functionally (with the `disabled` property) when the current quantity is equal to 1. This prevents users from reducing the quantity below 1 via the minus button, routing item removal through the dedicated remove/trash buttons.
  * **Dedicated Removal Endpoint**: Integrated the `https://localhost:7103/api/Cart/RemoveCart` POST endpoint in `removeCartItemFromApi`. When a user clicks the remove/trash icon (or updates quantity to 0 or less), the app automatically sends the payload containing the `customerId`, `productId`, `variantId`, and current `quantity` to remove the line item from the database. It then updates the local cart state with the new cart structure returned in the API's success response.
  * **Dynamic Tea Masala Category Page**: Updated `TeaMasalaCategoryPage.tsx` to pull tea masala products from the live backend API using `fetchProductsFromApi(18)` (category ID 18). Configured the premium Sparkle spinner block to hide product elements during initialization, mapped fetched results back into the global products list for checkout routing, and integrated red low-stock alert badges (`Available only: {stock}`) for items with fewer than 10 units in stock.
  * **Variant Image Lock**: Modified `ProductPage.tsx` (`handleAttrSelect`, `handleVariantSelect`, `handleAddToCart`, `handleBuyNow`) and `CartContext.tsx` (`resolveCartItem`) to keep the default/original product gallery and list images intact when a variant is selected or resolved in the shopping cart. Image arrays are no longer mutated or switched to match the selected variant's `imagePath` property.

## 11. Product Listing Price Range (Min-Max) Feature
* **Files modified**:
  * [SoapCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/SoapCategoryPage.tsx)
  * [MukhwasCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/MukhwasCategoryPage.tsx)
  * [TeaMasalaCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/TeaMasalaCategoryPage.tsx)
  * [HairOilCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/HairOilCategoryPage.tsx)
  * [HridhaySpecialCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/HridhaySpecialCategoryPage.tsx)
* **Changes**:
  * **Dynamic Price Range Calculation**: Implemented `renderPrice()` in all five category listing pages to scan each product's `variants` array. If a product has more than 1 variant, it calculates the minimum and maximum price across all its variants and renders them formatted as a range, e.g. `₹85 - ₹120`. Otherwise, it falls back to showing the default single price.
  * **Syntax Error Cleanups**: Removed a leftover duplicate snippet of `useScroll` options and `y` hook declarations under `renderPrice` inside `SoapCategoryPage.tsx` which was causing compilation warnings.
  * **Hridhay Special Variants Curation**: Extended the `HridhaySpecialCard` component with variants capability and wired `HridhaySpecialCategoryPage` to map and enrich its local reserve listings on mount using shared memory `products` containing parsed variants.


