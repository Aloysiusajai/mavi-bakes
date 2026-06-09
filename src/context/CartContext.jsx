"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch {}
  }, [items]);

  const addToCart = (item) => {
    setItems((prev) => {
      const found = prev.find((p) => p.id === item.id);
      if (found) {
        return prev.map((p) => (p.id === item.id ? { ...p, quantity: p.quantity + item.quantity } : p));
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
