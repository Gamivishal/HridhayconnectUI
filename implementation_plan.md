# Mobile "My Account" Redesign Plan (Flipkart/Amazon Style)

Redesign the mobile view of the "My Account" page to hide the sidebar/menu by default and replace it with a smooth left-sliding drawer, matching modern premium e-commerce UX (like Flipkart, Amazon, and Myntra).

## Proposed Changes

### Profile Page

#### [MODIFY] [ProfilePage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/ProfilePage.tsx)
- **Imports**: Add `Heart` and `Menu` to the icons imported from `lucide-react` on line 3.
- **State**:
  - Add `isDrawerOpen` (Boolean) to track mobile drawer open/close status.
  - Define `handleLogout` to encapsulate the log out operations.
- **Left Sliding Drawer (Mobile-only)**:
  - Add a `<AnimatePresence>`-wrapped sidebar drawer.
  - Show a dark blurred backdrop covering the screen, closing the drawer when tapped.
  - Implement a `motion.div` drawer sliding from the left (`x: "-100%"` to `0`) over 300ms.
  - **Drawer Top**: Circular profile avatar with initial letter, Customer Name, "Welcome Back", Reward Coins, and Total Orders.
  - **Drawer Navigation**: Expose outline menu items (Profile Details, Order History, Addresses, Wishlist, Rewards, Notifications, Change Password, Logout) styled at `56px` height, `18px` text size, `16px` border-radius, and purple highlighting for active states.
- **Header Section**:
  - Add a hamburger `Menu` button beside the "My Account" title (visible only on mobile, `lg:hidden`).
- **Main Page Content**:
  - Keep the desktop sidebar visible under `lg:block`, but hide it on mobile using the `hidden lg:block` Tailwind classes.
  - Ensure the main content section spans full width on mobile devices and renders only the Welcome Card, Personal Details, Referral Card, and Edit Profile screens without any inner menu duplication.

---

## Verification Plan

### Automated Tests
- Run `npm run lint` (`tsc --noEmit`) to verify compiling safety.

### Manual Verification
- Render the profile page in mobile responsive simulation.
- Verify the desktop-only vertical sidebar is hidden.
- Click the hamburger button to trigger the drawer.
- Test closing the drawer by clicking the close button and the blurred backdrop overlay.
- Navigate between tabs (Profile, Orders, Addresses, etc.) and check that drawer auto-closes, page content loads, and the active menu item highlights in purple.
