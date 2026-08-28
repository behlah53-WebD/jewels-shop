"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { imgs, products as fallbackProducts } from "@/lib/data";

export interface CartItemType {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
}

interface StoreContextType {
  count: number;
  cartItems: CartItemType[];
  save: string[];
  menu: boolean;
  search: boolean;
  bag: boolean;
  add: (itemOrProduct?: any, quantity?: number, size?: string) => void;
  updateQuantity: (product: string, quantity: number, size?: string) => void;
  removeFromCart: (product: string, size?: string) => void;
  clearCart: () => void;
  toggle: (id: string) => void;
  setMenu: (open: boolean) => void;
  setSearch: (open: boolean) => void;
  setBag: (open: boolean) => void;
  syncCartAndWishlist: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [bag, setBag] = useState(false);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [save, setSave] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize from localStorage first for guests
  useEffect(() => {
    try {
      const localCart = localStorage.getItem("aurelia_cart");
      if (localCart) {
        const parsed = JSON.parse(localCart);
        if (Array.isArray(parsed)) setCartItems(parsed);
      }

      const localSave = localStorage.getItem("aurelia_wishlist");
      if (localSave) {
        const parsed = JSON.parse(localSave);
        if (Array.isArray(parsed)) setSave(parsed);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Sync with backend API on mount
  useEffect(() => {
    syncCartAndWishlist();
  }, []);

  const syncCartAndWishlist = async () => {
    try {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();

      if (meData.success && meData.user) {
        setIsAuthenticated(true);
        const [cartRes, wishlistRes] = await Promise.all([
          fetch("/api/cart").then((r) => r.json()),
          fetch("/api/wishlist").then((r) => r.json()),
        ]);

        if (cartRes.success && Array.isArray(cartRes.items)) {
          setCartItems(cartRes.items);
          localStorage.setItem("aurelia_cart", JSON.stringify(cartRes.items));
        }

        if (wishlistRes.success && Array.isArray(wishlistRes.products)) {
          setSave(wishlistRes.products);
          localStorage.setItem("aurelia_wishlist", JSON.stringify(wishlistRes.products));
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Cart/Wishlist Sync Error:", err);
    }
  };

  const updateCartState = (newItems: CartItemType[]) => {
    setCartItems(newItems);
    try {
      localStorage.setItem("aurelia_cart", JSON.stringify(newItems));
    } catch (e) {}

    if (isAuthenticated) {
      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: newItems }),
      }).catch(console.error);
    }
  };

  const updateWishlistState = (newSave: string[]) => {
    setSave(newSave);
    try {
      localStorage.setItem("aurelia_wishlist", JSON.stringify(newSave));
    } catch (e) {}

    if (isAuthenticated) {
      fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: newSave }),
      }).catch(console.error);
    }
  };

  const add = (itemOrProduct?: any, quantity: number = 1, size: string = "6") => {
    let newItem: CartItemType;

    if (itemOrProduct && typeof itemOrProduct === "object") {
      const pid = itemOrProduct._id || itemOrProduct.id || itemOrProduct.slug || "solenne";
      newItem = {
        product: pid,
        name: itemOrProduct.name || "Solenne Emerald-Cut Ring",
        price: typeof itemOrProduct.price === "number" ? itemOrProduct.price : 186000,
        quantity: quantity,
        image: itemOrProduct.featuredImage || itemOrProduct.image || (itemOrProduct.images && itemOrProduct.images[0]) || imgs.ring,
        size: size,
      };
    } else if (typeof itemOrProduct === "string") {
      newItem = {
        product: itemOrProduct,
        name: "Solenne Emerald-Cut Ring",
        price: 186000,
        quantity: quantity,
        image: imgs.ring,
        size: size,
      };
    } else {
      const fallback = fallbackProducts[0];
      newItem = {
        product: fallback.id || "solenne",
        name: fallback.name,
        price: 186000,
        quantity: quantity,
        image: fallback.image || imgs.ring,
        size: size,
      };
    }

    const existingIndex = cartItems.findIndex(
      (x) => x.product.toString() === newItem.product.toString() && x.size === newItem.size
    );

    let updatedCart: CartItemType[];
    if (existingIndex > -1) {
      updatedCart = cartItems.map((x, idx) =>
        idx === existingIndex ? { ...x, quantity: x.quantity + newItem.quantity } : x
      );
    } else {
      updatedCart = [...cartItems, newItem];
    }

    updateCartState(updatedCart);
    setBag(true);
  };

  const updateQuantity = (productId: string, quantity: number, size?: string) => {
    let updatedCart: CartItemType[];
    if (quantity <= 0) {
      updatedCart = cartItems.filter(
        (x) => !(x.product.toString() === productId.toString() && (size ? x.size === size : true))
      );
    } else {
      updatedCart = cartItems.map((x) =>
        x.product.toString() === productId.toString() && (size ? x.size === size : true)
          ? { ...x, quantity }
          : x
      );
    }
    updateCartState(updatedCart);
  };

  const removeFromCart = (productId: string, size?: string) => {
    const updatedCart = cartItems.filter(
      (x) => !(x.product.toString() === productId.toString() && (size ? x.size === size : true))
    );
    updateCartState(updatedCart);
  };

  const clearCart = () => {
    updateCartState([]);
  };

  const toggle = (id: string) => {
    const newSave = save.includes(id) ? save.filter((y) => y !== id) : [...save, id];
    updateWishlistState(newSave);
  };

  const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        count,
        cartItems,
        save,
        menu,
        search,
        bag,
        add,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggle,
        setMenu,
        setSearch,
        setBag,
        syncCartAndWishlist,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
