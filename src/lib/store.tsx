import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getProduct } from "./products";

export type CartItem = { id: string; size: number; qty: number };

type Store = {
  cart: CartItem[];
  favorites: string[];
  addToCart: (id: string, size: number, qty?: number) => void;
  setQty: (id: string, size: number, qty: number) => void;
  removeFromCart: (id: string, size: number) => void;
  clearCart: () => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  cartCount: number;
  subtotal: number;
};

const Ctx = createContext<Store | null>(null);
const CART_KEY = "ahmed-shoes-cart";
const FAV_KEY = "ahmed-shoes-favorites";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem(CART_KEY) || "[]"));
      setFavorites(JSON.parse(localStorage.getItem(FAV_KEY) || "[]"));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, loaded]);
  useEffect(() => {
    if (loaded) localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
  }, [favorites, loaded]);

  const addToCart = (id: string, size: number, qty = 1) =>
    setCart((c) => {
      const ex = c.find((i) => i.id === id && i.size === size);
      if (ex) return c.map((i) => (i === ex ? { ...i, qty: i.qty + qty } : i));
      return [...c, { id, size, qty }];
    });
  const setQty = (id: string, size: number, qty: number) =>
    setCart((c) =>
      qty <= 0
        ? c.filter((i) => !(i.id === id && i.size === size))
        : c.map((i) => (i.id === id && i.size === size ? { ...i, qty } : i)),
    );
  const removeFromCart = (id: string, size: number) => setQty(id, size, 0);
  const clearCart = () => setCart([]);
  const toggleFavorite = (id: string) =>
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + (getProduct(i.id)?.price ?? 0) * i.qty, 0);

  return (
    <Ctx.Provider
      value={{ cart, favorites, addToCart, setQty, removeFromCart, clearCart, toggleFavorite, isFavorite: (id) => favorites.includes(id), cartCount, subtotal }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be inside StoreProvider");
  return s;
}

export const DELIVERY_FEE = 2000;
export const FREE_DELIVERY_FROM = 50000;
export const deliveryFor = (subtotal: number) => (subtotal === 0 || subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE);
