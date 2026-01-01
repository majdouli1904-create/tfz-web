import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: number;
  title: string;
  price: number;
  image?: string;
  category?: string;
  quantity: number;
};

type CartContextValue = {
  cart: CartItem[];
  add: (p: Omit<CartItem, "quantity">) => void;
  remove: (index: number) => void;
  increase: (index: number) => void;
  decrease: (index: number) => void;
  total: number;
  itemCount: number;
  clear: () => void;
};

const CART_KEY = "tfz_cart_v1";
const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) setCart(JSON.parse(raw));
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  const add = (p: Omit<CartItem, "quantity">) => {
    setCart(prev => {
      const idx = prev.findIndex(x => x.id === p.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + 1 };
        return copy;
      }
      return [...prev, { ...p, quantity: 1 }];
    });
  };

  const remove = (index: number) => setCart(prev => prev.filter((_, i) => i !== index));
  const increase = (index: number) =>
    setCart(prev => prev.map((it, i) => (i === index ? { ...it, quantity: it.quantity + 1 } : it)));
  const decrease = (index: number) =>
    setCart(prev =>
      prev.flatMap((it, i) => {
        if (i !== index) return it;
        if (it.quantity <= 1) return [];
        return { ...it, quantity: it.quantity - 1 };
      })
    );
  const clear = () => setCart([]);

  const total = useMemo(() => cart.reduce((s, it) => s + it.price * it.quantity, 0), [cart]);
  const itemCount = useMemo(() => cart.reduce((s, it) => s + it.quantity, 0), [cart]);

  return (
    <CartContext.Provider value={{ cart, add, remove, increase, decrease, total, itemCount, clear }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
};