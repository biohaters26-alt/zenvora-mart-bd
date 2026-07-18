"use client";

import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "zenvora_cart_v1";

function cartReducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      return action.payload || state;

    case "ADD_ITEM": {
      const { item } = action;
      const existingIndex = state.items.findIndex(
        (i) => i.productId === item.productId && i.variant === item.variant
      );
      if (existingIndex > -1) {
        const items = [...state.items];
        items[existingIndex] = {
          ...items[existingIndex],
          quantity: items[existingIndex].quantity + item.quantity
        };
        return { ...state, items };
      }
      return { ...state, items: [...state.items, item] };
    }

    case "UPDATE_QUANTITY": {
      const items = state.items
        .map((i) =>
          i.productId === action.productId && i.variant === action.variant
            ? { ...i, quantity: Math.max(action.quantity, 0) }
            : i
        )
        .filter((i) => i.quantity > 0);
      return { ...state, items };
    }

    case "REMOVE_ITEM": {
      const items = state.items.filter(
        (i) => !(i.productId === action.productId && i.variant === action.variant)
      );
      return { ...state, items };
    }

    case "APPLY_COUPON":
      return { ...state, coupon: action.coupon };

    case "REMOVE_COUPON":
      return { ...state, coupon: null };

    case "CLEAR_CART":
      return { items: [], coupon: null };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], coupon: null });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) dispatch({ type: "HYDRATE", payload: JSON.parse(saved) });
    } catch (e) {
      /* ignore corrupt storage */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const subtotal = useMemo(
    () => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [state.items]
  );

  const itemCount = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items]
  );

  const value = {
    items: state.items,
    coupon: state.coupon,
    subtotal,
    itemCount,
    addItem: (item) => dispatch({ type: "ADD_ITEM", item }),
    updateQuantity: (productId, variant, quantity) =>
      dispatch({ type: "UPDATE_QUANTITY", productId, variant, quantity }),
    removeItem: (productId, variant) => dispatch({ type: "REMOVE_ITEM", productId, variant }),
    applyCoupon: (coupon) => dispatch({ type: "APPLY_COUPON", coupon }),
    removeCoupon: () => dispatch({ type: "REMOVE_COUPON" }),
    clearCart: () => dispatch({ type: "CLEAR_CART" })
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
