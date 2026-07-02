# Walkthrough - Razorpay Payment Integration, Clear Banner Images, Mobile "My Account" Redesign, Paragraph Justification, Hover Alternate Image, Button Renaming & Price Filter

Successfully integrated Razorpay payment gateway (handling Cards, UPI, Netbanking, Wallets) with backend HMAC-SHA256 signature verification, removed the blur/haze effect and upgraded resolutions for all background banner images, completed the mobile view redesign of the "My Account" page, applied text justification to key editorial paragraphs, implemented alternate product image cross-fade hover animations, renamed the purchase buttons from "Add to Ritual" to "Add to Cart" globally, and added a price range filter widget to all category product lists.

## Changes Made

### Razorpay Payment Integration
- **Backend Setup (Verified & Active)**:
  - App settings credentials configured in `appsettings.json`.
  - Implemented `PaymentController.cs` exposing `POST /api/Payment/create-order` (to initialize Razorpay order ID) and `POST /api/Payment/verify` (to verify payment signature using HMAC-SHA256 and invoke the repository Checkout flow).
  - Defined request and verification models in `CreateOrderRequest.cs`.
- **Frontend Integration ([CheckoutPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/CheckoutPage.tsx))**:
  - Dynamically injects the official Razorpay checkout script `https://checkout.razorpay.com/v1/checkout.js` into the DOM when an online payment is triggered.
  - Intercepts order placement: routes Cash on Delivery (`cod`) transactions through the original direct checkout endpoint while routing online payments through Razorpay.
  - Launches Razorpay modal with custom themes and prefilled customer details loaded from active local storage user profiles.
  - **Payment Options and UPI Configuration**: Configured the Razorpay options object to not force card prefill (leaving `prefill.method` as `undefined` for default selections) so the modal opens directly onto the main checkout selection screen. Explicitly defined `config.display.sequence` to list Cards, Netbanking, Wallets, and UPI (`block.upi`) in the popup sequence so that customers can pay using UPI apps like Google Pay (GPay), PhonePe, Paytm, etc.
  - **Dynamic Payment Mode Identification & Transmission**: Integrated a listener for the Razorpay `payment.submit` event to dynamically capture what payment method (card, netbanking, wallet, upi) the customer actually selects inside the popup. Maps this dynamically to the requested numeric identifiers (`3` for card, `4` for netbanking, `1` for wallet, and `2` for UPI) and transmits it as both `PaymentMode` and `paymentMode` fields in the `/api/Payment/verify` payload.
  - Verifies payment on success via the secure backend API before final checkout execution and clears cart cache upon receipt of order confirmations containing the verified Order Numbers.
  - Incorporates error handling, cancellation tracking, loading status updates, and retry support on failure.

### Clear Banner Images
- Modified [InnerPageBanner.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/InnerPageBanner.tsx) to increase the background image opacity from `0.42` to `0.90` and removed the `saturate-[0.8]` class to allow natural, vibrant colors.
- Softened the heavy gradient text readability overlay from `from-[var(--color-cream)] via-[var(--color-cream)]/88 to-transparent` to `from-[var(--color-cream)]/90 via-[var(--color-cream)]/35 to-transparent` to ensure the banner images are crisp and visible while maintaining text readability.
- Replaced external Unsplash background images with local, high-quality WebP banner assets:
  - [SoapCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/SoapCategoryPage.tsx): `/Image/Bannerimg/HomeMadeSoap.webp`
  - [HairOilCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/HairOilCategoryPage.tsx): `/Image/Bannerimg/HairOil.webp`
  - [MukhwasCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/MukhwasCategoryPage.tsx): `/Image/Bannerimg/Mukhwas.webp`
  - [TeaMasalaCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/TeaMasalaCategoryPage.tsx): `/Image/Bannerimg/TeaMasala.webp`
  - [HridhaySpecialCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/HridhaySpecialCategoryPage.tsx): `/Image/Bannerimg/HridhaySpecial.webp`
  - [ContactPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/ContactPage.tsx) (remains unchanged)


### Mobile "My Account" Redesign
- Redesigned [ProfilePage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/ProfilePage.tsx) to hide the sidebar menu on mobile layouts (`hidden lg:block`).
- Integrated a custom sliding drawer menu triggered via a hamburger button beside the "My Account" title on mobile view.
- Added a dark backdrop blur backdrop overlay (`bg-black/40 backdrop-blur-sm`) which collapses the drawer when tapped.
- Exposed high-fidelity outline navigation items (Profile Details, Order History, Addresses, Wishlist, Rewards, Notifications, Change Password, and Logout) inside the mobile drawer.
- Structured drawer headers to showcase profile avatar, customer name, Welcome Back text, Reward Coins, and Total Orders count.

### Paragraph Text Justification
Implemented the `text-justify` layout class for descriptive, multi-line typography blocks inside:
1. **Home Page**:
   - Both philosophy paragraphs inside [BrandStory.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/BrandStory.tsx) to align left and right borders evenly.
   - Ingredient alchemy paragraph inside [Ingredients.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/Ingredients.tsx).
   - Routine ritual transformation paragraph inside [WellnessExperience.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/WellnessExperience.tsx).
   - Testimonial feedback paragraphs in the "Words from our Community" section inside [Testimonials.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/Testimonials.tsx).
2. **About Page** ([AboutPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/AboutPage.tsx)):
   - Immersive Origin text blocks.
   - Purity formulation text block in "The Formulation" section.
   - Mindful self-care text block in "The Living Devotion" section.
   - Milestone description text blocks (2023, 2024, 2025, 2026 milestones) in the "Timeline of Growth" section.
3. **Contact Page** ([ContactPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/ContactPage.tsx)):
   - Help / assistance introductory text.
4. **Footer** ([Footer.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/Footer.tsx)):
   - Studio physical address text.

### Hover Alternate Product Image Cross-fade
Implemented secondary image hover effects across the following components:
1. **Product Grid Lists** ([SectionGrid.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/SectionGrid.tsx)):
   - Configured lookup logic to map products to the synced global cache (`products` array) to retrieve complete image arrays.
   - Added conditional transition formatting so the primary image only fades out if a secondary image `images[1]` actually exists, preventing blank cards.
2. **Product Carousels** ([SectionCarousel.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/SectionCarousel.tsx) and [CategoryCarousel.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/CategoryCarousel.tsx)):
   - Applied lookup and conditional class matching to support smooth fallback scaling without card blanking.
3. **App Initialization Category Prefetching** ([App.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/App.tsx)):
   - Configured background pre-fetching loop to load category product structures (with all image arrays) on app initialization, ensuring high-fidelity product images are cached for home page display.
4. **Artisanal Home Made Soaps** ([SoapCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/SoapCategoryPage.tsx)):
   - Updated the mapping routine to parse, sort, and save all variant images in the product list objects.
   - Added `images` array definition to `SoapCardProps`.
   - Overlayed alternate images within `SoapCard` and animated opacity cross-fades conditionally.
5. **Keshvedaam Ayurvedic Hair Oils** ([HairOilCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/HairOilCategoryPage.tsx)):
   - Mapped `images: p.images` to the oil cards data objects.
   - Overlayed and animated alternate image cross-fading inside `HairOilCard` conditionally.
6. **Digestive Heritage Mukhwas** ([MukhwasCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/MukhwasCategoryPage.tsx)):
   - Bound fetched `p.images` to mapped mukhwas card lists.
   - Rendered secondary images absolute inside `MukhwasCard` with hover animations conditionally.
7. **Artisanal Tea Masala** ([TeaMasalaCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/TeaMasalaCategoryPage.tsx)):
   - Configured cross-fade image hover transitions inside `TeaMasalaCard` conditionally.
8. **Hridhay Special Reserve** ([HridhaySpecialCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/HridhaySpecialCategoryPage.tsx)):
   - Configured cross-fade image hover transitions inside `HridhaySpecialCard` conditionally.
9. **Related Products Slider** ([ProductPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/ProductPage.tsx)):
   - Applied conditional cross-fade layouts inside the Related Products cards.

### Button Renaming & Styling
Renamed purchase action buttons across the application and styled them to prevent text-wrapping:
1. Changed `Add to Ritual` to `Add to Cart` and `Added to Ritual` to `Added to Cart` on all category lists and grids, adding `whitespace-nowrap` to prevent multi-line wrapping:
   - [SoapCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/SoapCategoryPage.tsx)
   - [HairOilCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/HairOilCategoryPage.tsx)
   - [MukhwasCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/MukhwasCategoryPage.tsx)
   - [TeaMasalaCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/TeaMasalaCategoryPage.tsx)
   - [HridhaySpecialCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/HridhaySpecialCategoryPage.tsx)
2. Updated Product Details and Sticky purchase actions inside [ProductPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/ProductPage.tsx).
3. Updated featured collection action button text in [FeaturedCollection.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/FeaturedCollection.tsx).

### Price Range Filter on Category Pages
Implemented an interactive Price Filter inside the product collection views:
1. **Category Sidebar Integration** ([CategorySidebar.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/CategorySidebar.tsx)):
   - Removed the left-side "Filter by Price" dual-range slider UI section from the `CategorySidebar` to simplify the sidebar layout.
2. **State, Filtering & Top-Right Filter Layout on Categories**:
   - Added states (`minPrice`, `maxPrice`) inside all category landing files.
   - Wired states and change handlers to `<CategorySidebar />`.
   - Dynamic Price Range Bound Initialization: Instead of hardcoded `0-1000` bounds, the application dynamically scans the loaded product list on initialization to find the maximum product price, automatically sets the initial state of `maxPrice` to this maximum, and binds the range slider maximum bounds to this dynamic limit.
   - Filtered local listing collections matching `sellPrice ?? price` boundaries before rendering lists.
   - Rendered a custom inline glassmorphic Price Filter card containing the new dual-handled slider and dynamic range text (`₹{minPrice} - ₹{maxPrice}`) inside the category header row on the right side.
   - Integrated this filter logic and UI layout across all five category pages:
     - [SoapCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/SoapCategoryPage.tsx)
     - [HairOilCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/HairOilCategoryPage.tsx)
     - [MukhwasCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/MukhwasCategoryPage.tsx)
     - [TeaMasalaCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/TeaMasalaCategoryPage.tsx)
     - [HridhaySpecialCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/HridhaySpecialCategoryPage.tsx)

### Dynamic Category Names from API
Mapped category names dynamically from database/API endpoints:
1. **Sidebar Menu Category Updates** ([CategorySidebar.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/CategorySidebar.tsx)):
   - Converted static categories array into React state.
   - Fetches dynamic category naming from the home layout endpoint (`/Home/GetHomeComponent`) on mount, automatically matching by `categoryId` and replacing static titles (e.g. mapping "Home Made Mukhwas" to "Mukhwas" as configured in the database).
2. **Category Banners & Titles**:
   - Updated [MukhwasCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/MukhwasCategoryPage.tsx), [TeaMasalaCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/TeaMasalaCategoryPage.tsx), and [HridhaySpecialCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/HridhaySpecialCategoryPage.tsx) to fetch and assign the primary category name string returned by the first product record dynamically rather than leaving them statically initialized.

### Banner Image Text Legibility
- Updated [InnerPageBanner.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/InnerPageBanner.tsx) to render the text block content in a high-contrast white font with responsive text shadow styling when a background image is present.
- Configured a dark gradient overlay (`from-black/60 via-black/20 to-transparent`) behind the text instead of the cream gradient when banner images are present to allow maximum visibility of the backgrounds while keeping titles and description text completely crisp and legible.

### Header Navigation Highlight Bug Fix
- Fixed an issue in [Navigation.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/Navigation.tsx) where both the "Shop By Category" dropdown button and the "Hridhay Special" menu item were highlighted as selected concurrently when viewing the "Hridhay Special" page. Excluding "Hridhay Special" from the category page check array ensures only the standalone "Hridhay Special" link displays the bold selected style.

### Empowering Every User Mobile Spacing Fix
- Modified [scrolling-animation.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/ui/scrolling-animation.tsx) to increase the maximum circle expansion radius (`maxRadius`) on mobile layouts from `100` to `120` in the resize listener.
- Adjusted the mobile font size of the "Empowering Every User" titles from `text-lg` (18px) to `text-base` (16px) to reduce layout width. These changes prevent the expanding profile photos (on the left and right sides) from touching or overlapping the first ("E") and last ("g") letters of the text.

### Mobile Menu Drawer Spacing & Reordering
- Updated [Navigation.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/Navigation.tsx) to reorganize the drawer items layout on mobile views to the following sequence: **Home -> About -> Shop By Category (Accordion) -> Hridhay Special -> Contact**.
- Removed the **Shopping Cart** link from the mobile menu drawer completely, as it is already permanently present and active directly in the header bar.

### Contact Us Form Validation
- Completely removed all HTML5 browser-level `required` attributes and visual `*` (compulsory) markings from all input fields (including **Name**, **Email**, **Mobile Number**, **Subject**, and **Message**) in [ContactPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/ContactPage.tsx).
- Defer all validation checks and messages entirely to the server-side API, avoiding standard browser "Please fill out this field" validation warnings on the client UI.
- Maintained the numeric character filter on the **Mobile Number** field to restrict typed inputs to a max length of **10 digits**.
- Removed the inline JSX error banner from the contact form so that feedback is delivered cleanly and exclusively via Toast notifications.

### Contact Us API Integration
- Hooked up the Contact Us form inside [ContactPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/ContactPage.tsx) to perform a POST request to the backend save endpoint `/ContactUs/Save` (via the central `post` utility).
- Formatted the request payload object with key names exactly matching the required parameters: `name`, `email`, `mobileNumber`, `subject`, and `message`.
- Integrated `showApiResponseToast` and `showToast` from [toastService.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/utils/toastService.tsx) inside `handleSubmit`. If the API responds with a successful status code but contains a payload body indicating validation failure (such as `isSuccess: false` with validation descriptions), the application dynamically triggers a red error notification toast showing the validation message (e.g. *"Please enter Name."*), and halts form success redirects. All submission warnings/errors are now styled and outputted solely through these toaster notifications.

### Navigation and Footer Naming Alignment
- Updated [Navigation.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/Navigation.tsx) and [Footer.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/Footer.tsx) category names to align with url routing paths and match the database category names returned by the API.
- Configured category naming options in Navigation and Footer lists to: **Home Made Soap** (for `#soap`), **Home Made Hair Oil** (for `#hair-oil`), **Mukhwas** (for `#mukhwas`), **Tea Masala** (for `#tea-masala`), and **Hridhay Special** (for `#hridhay-special`). This matches the specific visual headers loaded on each category detail page.

### Price Filter Manual Input Restriction
- Removed the manual min/max digit number input boxes (`input type="number"`) from the price filter panels across all category page templates: [SoapCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/SoapCategoryPage.tsx), [HairOilCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/HairOilCategoryPage.tsx), [MukhwasCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/MukhwasCategoryPage.tsx), [TeaMasalaCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/TeaMasalaCategoryPage.tsx), and [HridhaySpecialCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/HridhaySpecialCategoryPage.tsx).
- Users are now limited strictly to using the dual range slider dots to filter items, preventing manual numeric typing errors on the frontend.

### My Account Header & Mobile Menu Items Layout
- Updated [Navigation.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/Navigation.tsx) to align the "My Account" dropdown/accordion menu items across desktop and mobile views.
- Added **Change Password** option using the `Shield` icon to both the desktop My Account hover dropdown (after **Rewards**) and the mobile navigation drawer profile accordion menu.
- Restored **Notifications** to the mobile menu drawer profile accordion menu.
- Renamed the desktop profile dropdown action label from **Sign Out** to **Logout** to match the mobile menu text.
- Re-imported the `Shield` icon from `lucide-react` in `Navigation.tsx`.

### Homepage Product Image Enrichment (Alternate Images Fix)
- Updated [productService.ts](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/api/productService.ts) inside `parseApiProductGroup` to keep dynamic database/API product images intact and avoid merging static Unsplash placeholders. This ensures dynamic product details and listings only show correct dynamic assets uploaded on the backend database.

### Mobile Viewport Slider Items Fix (Exactly 2 Images)
- Modified [CategoryCarousel.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/CategoryCarousel.tsx) and [SectionCarousel.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/SectionCarousel.tsx) resize handlers to set `itemsPerView` to exactly `2` on mobile screen resolutions (< 768px).
- This aligns the layout to show two complete equal-width slides at a time rather than 1.5 or 1.2 partially visible slides, ensuring smooth scrolling without horizontal overflow on smaller screens.

### Compilation Hotfix (Duplicate Object Literal Key)
- Removed a duplicate declaration of the `productId` key in the return object block of the `parseApiProductGroup` function in [productService.ts](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/api/productService.ts#L323), fixing the TypeScript error *"An object literal cannot have multiple properties with the same name."*

### Contact Form Compulsory Markings
- Added red-colored asterisks `*` to the **Name**, **Email Address**, and **Mobile Number** labels inside [ContactPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/ContactPage.tsx) to clarify to users which fields are mandatory.

---

## Verification Results
- All files verified for proper import syntax and formatting structure.
- Type definitions adjusted globally to ensure compatibility and strict check safety.
- Handled empty image scenarios to ensure fallback is graceful (primary image remains visible and scales up instead of disappearing).
- Confirmed that there are no remaining "Add to Ritual" button labels in the codebase.
- Verified that all add-to-cart buttons have the `whitespace-nowrap` class applied to display text cleanly in a single line.
- Verified price range bounds mapping dynamically to prevent React key exceptions or NaN ranges.
- Confirmed dynamic range calculations correctly set the filter range defaults to `0` and the category's actual maximum price.
- Verified that dual range sliders accurately drag from both left (minPrice) and right (maxPrice) dots without exceeding limits or overlapping errors.
- Verified that the "My Account" dropdown options on desktop show: **Profile Details**, **Order History**, **Addresses**, **Rewards**, **Change Password**, and **Logout**.
- Verified that the mobile "My Profile" accordion inside the header drawer shows: **Profile Details**, **Order History**, **Addresses**, **Rewards**, **Notifications**, and **Change Password** (with **Logout** styled below).
- Verified that products loaded in the homepage **CategoryCarousel** and **SectionCarousel** (New Arrivals, Best Sellers) now successfully contain multiple images, enabling the alternate cross-fade hover animation.
- Verified that the homepage carousels on screen resolutions < 768px now display exactly two complete, equal-width items side-by-side.
- Verified TypeScript compilation compiles cleanly with no duplicate object keys.
- Verified that the contact form displays red asterisks next to Name, Email Address, and Mobile Number.
