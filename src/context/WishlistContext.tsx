import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { wishlistService, WishlistItem } from "../api/wishlistService";
import { useSignUp } from "./SignUpContext";
import { showToast } from "../utils/toastService";

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  loading: boolean;
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (productId: number, variantId: number, packingType?: string) => Promise<void>;
  isInWishlist: (productId: number, variantId?: number, packingType?: string) => boolean;
  clearWishlist: () => void;
  removeFromWishlist: (wishlistId: number, silent?: boolean) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlistItems: [],
  loading: false,
  fetchWishlist: async () => {},
  toggleWishlist: async () => {},
  isInWishlist: () => false,
  clearWishlist: () => {},
  removeFromWishlist: async () => {}
});

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { openSignUp } = useSignUp();

  const fetchWishlist = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setWishlistItems([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const items = await wishlistService.getAll();
      setWishlistItems(items);
    } catch (error) {
      console.error("Error fetching wishlist", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
    
    const handleAuthChange = () => fetchWishlist();
    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, []);

  const isInWishlist = (productId: number, variantId?: number, packingType?: string) => {
    return wishlistItems.some(item => {
      const isProductMatch = item.ProductId === productId;
      const isVariantMatch = variantId === undefined || item.VariantId === variantId;
      
      let isPackingMatch = true;
      if (packingType && typeof packingType === 'string') {
        if (typeof item.PackingType === 'string' && item.PackingType) {
          isPackingMatch = item.PackingType.toLowerCase() === packingType.toLowerCase();
        } else {
          isPackingMatch = false;
        }
      }
      
      return isProductMatch && isVariantMatch && isPackingMatch;
    });
  };

  const toggleWishlist = async (productId: number, variantId: number, packingType?: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      openSignUp('signin');
      return;
    }

    const existingItem = wishlistItems.find(item => {
      const isProductMatch = item.ProductId === productId;
      const isVariantMatch = item.VariantId === variantId;
      
      let isPackingMatch = true;
      if (packingType && typeof packingType === 'string') {
        if (typeof item.PackingType === 'string' && item.PackingType) {
          isPackingMatch = item.PackingType.toLowerCase() === packingType.toLowerCase();
        } else {
          isPackingMatch = false;
        }
      }
      
      return isProductMatch && isVariantMatch && isPackingMatch;
    });
    
    // Optimistic Update
    if (existingItem) {
      setWishlistItems(prev => prev.filter(item => item.Id !== existingItem.Id));
      showToast('success', 'Product removed from wishlist');
      
      try {
        await wishlistService.remove(existingItem.Id);
      } catch (error) {
        // Revert on failure
        setWishlistItems(prev => [...prev, existingItem]);
        showToast('error', 'Failed to remove from wishlist');
      }
    } else {
      // Create a temporary item for optimistic update
      const tempId = Date.now();
      const tempItem: WishlistItem = {
        Id: tempId,
        ProductId: productId,
        VariantId: variantId,
        ProductName: "Loading...",
        VariantAttributeValues_Only: "",
        CategoryId: 0,
        CategoryName: "",
        Price: 0,
        DiscountPercent: 0,
        SellPrice: 0,
        SKU: "",
        ImagePath: "",
        TotalAvailableStock: 0,
        CreatedDate: new Date().toISOString()
      };
      
      setWishlistItems(prev => [...prev, tempItem]);
      
      try {
        await wishlistService.add(productId, variantId, packingType);
        showToast('success', 'Product added to wishlist');
        // Fetch actual list to get real IDs and details
        fetchWishlist();
      } catch (error) {
        // Revert on failure
        setWishlistItems(prev => prev.filter(item => item.Id !== tempId));
        showToast('error', 'Failed to add to wishlist');
      }
    }
  };

  const removeFromWishlist = async (wishlistId: number, silent?: boolean) => {
    const itemToRemove = wishlistItems.find(item => item.Id === wishlistId);
    if (!itemToRemove) return;

    // Optimistic Update
    setWishlistItems(prev => prev.filter(item => item.Id !== wishlistId));
    if (!silent) showToast('success', 'Product removed from wishlist');

    try {
      await wishlistService.remove(wishlistId);
    } catch (error) {
      // Revert on failure
      setWishlistItems(prev => [...prev, itemToRemove]);
      showToast('error', 'Failed to remove from wishlist');
    }
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        fetchWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        removeFromWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
