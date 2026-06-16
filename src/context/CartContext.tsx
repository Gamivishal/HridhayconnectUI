import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "../data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartCount: number;
  cartSubtotal: number;
  // New checkout fields
  checkoutItems: CartItem[];
  prepareCheckout: (items: CartItem[]) => void;
  clearCheckout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("hridhay_cart");
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }

    try {
      const storedCheckout = localStorage.getItem("hridhay_checkout");
      if (storedCheckout) {
        setCheckoutItems(JSON.parse(storedCheckout));
      }
    } catch (e) {
      console.error("Failed to load checkout from localStorage", e);
    }
  }, []);

  // Save to localStorage on any cartItems changes
  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    try {
      localStorage.setItem("hridhay_cart", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  };

  const prepareCheckout = (items: CartItem[]) => {
    setCheckoutItems(items);
    try {
      localStorage.setItem("hridhay_checkout", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save checkout to localStorage", e);
    }
  };

  const clearCheckout = () => {
    setCheckoutItems([]);
    try {
      localStorage.removeItem("hridhay_checkout");
    } catch (e) {
      console.error("Failed to clear checkout from localStorage", e);
    }
  };

  const addToCart = (product: Product, quantity = 1) => {
    const existingIdx = cartItems.findIndex(item => item.product.id === product.id);
    let newItems = [...cartItems];

    if (existingIdx > -1) {
      newItems[existingIdx].quantity += quantity;
    } else {
      newItems.push({ product, quantity });
    }

    saveCart(newItems);
    setIsCartOpen(true); // Open the drawer as feedback
  };

  const removeFromCart = (productId: string) => {
    const newItems = cartItems.filter(item => item.product.id !== productId);
    saveCart(newItems);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const newItems = cartItems.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    );
    saveCart(newItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartCount,
        cartSubtotal,
        checkoutItems,
        prepareCheckout,
        clearCheckout
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
