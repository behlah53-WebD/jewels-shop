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
  authModal: boolean;
  isAuthenticated: boolean;
  add: (itemOrProduct?: any, quantity?: number, size?: string) => void;
  buyNow: (itemOrProduct?: any, quantity?: number, size?: string) => boolean;
  proceedToCheckout: () => boolean;
  updateQuantity: (product: string, quantity: number, size?: string) => void;
  removeFromCart: (product: string, size?: string) => void;
  clearCart: () => void;
  toggle: (id: string) => void;
  setMenu: (open: boolean) => void;
  setSearch: (open: boolean) => void;
  setBag: (open: boolean) => void;
  setAuthModal: (open: boolean) => void;
  syncCartAndWishlist: () => Promise<void>;
}

import { useDispatch } from "react-redux";
import {
  apiSlice,
  useGetMeQuery,
  useGetCartQuery,
  useUpdateCartMutation,
  useGetWishlistQuery,
  useUpdateWishlistMutation,
} from "@/lib/redux/api/apiSlice";
import { invalidateCache } from "@/lib/apiClient";

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [bag, setBag] = useState(false);
  const [authModal, setAuthModal] = useState(false);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [save, setSave] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // RTK Query auto-cached queries & mutations
  const { data: meData, refetch: refetchMe } = useGetMeQuery();
  const { data: cartData, refetch: refetchCart } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const { data: wishlistData, refetch: refetchWishlist } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });

  const [triggerUpdateCart] = useUpdateCartMutation();
  const [triggerUpdateWishlist] = useUpdateWishlistMutation();

  useEffect(() => {
    if (meData?.success && meData?.user) {
      setIsAuthenticated(true);
    } else if (meData && !meData.success) {
      setIsAuthenticated(false);
      setCartItems([]);
      setSave([]);
    }
  }, [meData]);

  useEffect(() => {
    if (isAuthenticated && cartData?.success && Array.isArray(cartData.items)) {
      setCartItems(cartData.items);
    } else if (!isAuthenticated) {
      setCartItems([]);
    }
  }, [isAuthenticated, cartData]);

  useEffect(() => {
    if (isAuthenticated && wishlistData?.success && Array.isArray(wishlistData.products)) {
      setSave(wishlistData.products);
    } else if (!isAuthenticated) {
      setSave([]);
    }
  }, [isAuthenticated, wishlistData]);

  const syncCartAndWishlist = async () => {
    try {
      invalidateCache();
      const meResult = await refetchMe();
      if (meResult.data?.success && meResult.data?.user) {
        setIsAuthenticated(true);
        dispatch(apiSlice.util.invalidateTags(["Cart", "Wishlist"]));
        try {
          const [cartRes, wishlistRes] = await Promise.all([
            fetch("/api/cart").then((r) => r.json()).catch(() => ({ success: false })),
            fetch("/api/wishlist").then((r) => r.json()).catch(() => ({ success: false })),
          ]);
          if (cartRes?.success && Array.isArray(cartRes.items)) {
            setCartItems(cartRes.items);
          }
          if (wishlistRes?.success && Array.isArray(wishlistRes.products)) {
            setSave(wishlistRes.products);
          }
        } catch {
          // ignore
        }
      } else {
        setIsAuthenticated(false);
        setCartItems([]);
        setSave([]);
      }
    } catch (err) {
      console.error("Sync error:", err);
      setIsAuthenticated(false);
      setCartItems([]);
      setSave([]);
    }
  };

  const updateCartState = (newItems: CartItemType[]) => {
    setCartItems(newItems);
    if (isAuthenticated) {
      triggerUpdateCart({ items: newItems }).catch(console.error);
    }
  };

  const updateWishlistState = (newSave: string[]) => {
    setSave(newSave);
    if (isAuthenticated) {
      triggerUpdateWishlist({ products: newSave }).catch(console.error);
    }
  };

  const proceedToCheckout = (): boolean => {
    if (!isAuthenticated) {
      setAuthModal(true);
      return false;
    }
    return true;
  };

  const buyNow = (itemOrProduct?: any, quantity: number = 1, size: string = "6"): boolean => {
    if (!isAuthenticated) {
      setAuthModal(true);
      return false;
    }
    add(itemOrProduct, quantity, size);
    return true;
  };

  const add = (itemOrProduct?: any, quantity: number = 1, size: string = "6") => {
    if (!isAuthenticated) {
      setAuthModal(true);
      return;
    }

    let newItem: CartItemType;

    // Check if itemOrProduct is a React SyntheticEvent object
    let target = itemOrProduct;
    if (target && typeof target === "object" && (target.nativeEvent || target._reactName || (!target.name && !target._id && !target.id && !target.slug))) {
      target = fallbackProducts[0];
    }

    if (target && typeof target === "object") {
      const pid = target._id || target.id || target.slug || "solenne";
      newItem = {
        product: pid.toString(),
        name: target.name || "Solenne Emerald-Cut Ring",
        price: typeof target.price === "number" ? target.price : 186000,
        quantity: quantity,
        image: target.featuredImage || target.image || (target.images && target.images[0]) || imgs.ring,
        size: size,
      };
    } else if (typeof target === "string") {
      newItem = {
        product: target,
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
    if (!isAuthenticated) {
      setAuthModal(true);
      return;
    }

    const pid = id.toString();
    const newSave = save.includes(pid) ? save.filter((y) => y !== pid) : [...save, pid];
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
        authModal,
        isAuthenticated,
        add,
        buyNow,
        proceedToCheckout,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggle,
        setMenu,
        setSearch,
        setBag,
        setAuthModal,
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
