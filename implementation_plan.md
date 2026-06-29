# Category Price Filter Plan (Top Right Side Update)

Add a price range filter widget (slider + numeric min/max inputs) to the top right side above the product grids, as well as the Category Sidebar, so users can filter product listings by price easily on all Category pages.

## Proposed Changes

---

### Category Pages

For each of the category pages:
1. **Soap Category Page** ([SoapCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/SoapCategoryPage.tsx))
2. **Hair Oil Category Page** ([HairOilCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/HairOilCategoryPage.tsx))
3. **Mukhwas Category Page** ([MukhwasCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/MukhwasCategoryPage.tsx))
4. **Tea Masala Category Page** ([TeaMasalaCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/TeaMasalaCategoryPage.tsx))
5. **Hridhay Special Category Page** ([HridhaySpecialCategoryPage.tsx](file:///c:/Users/Admin/source/repos/HridhayconnectUI/src/components/HridhaySpecialCategoryPage.tsx))

- Define states: `minPrice` (number, default 0) and `maxPrice` (number, default 1000).
- Render a new inline glassmorphic Price Filter card inside the category header row on the right side.
- Filter the loaded products list based on the selected price range before mapping them into card items.

---

## Verification Plan

### Automated Tests
- Run `npm run lint` (`tsc --noEmit`) to verify compiling and type safety.

### Manual Verification
- Navigate to any category page (e.g. Soaps or Mukhwas).
- Modify the price range slider or type numbers inside the Min/Max inputs on the right side at the top.
- Verify that only products within that price range are shown.
