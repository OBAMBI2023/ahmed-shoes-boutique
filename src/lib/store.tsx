import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getProduct } from "./products";

export const MAX_QTY = 10;

export type CartItem ={ id: string; size: number; qty: number };

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

function readJSON(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // stockage indisponible (navigation privée, quota) : on garde l'état en mémoire
  }
}

// Ne garde que les lignes valides : produit existant, pointure proposée, quantité entière positive.
function sanitizeCart(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const merged: CartItem[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const { id, size, qty } = row as Record<string, unknown>;
    if (typeof id !== "string" || typeof size !== "number" || typeof qty !== "number") continue;
    if (!Number.isInteger(qty) || qty <= 0) continue;
    if (!getProduct(id)?.sizes.includes(size)) continue;
    const ex = merged.find((i) => i.id === id && i.size === size);
    if (ex) ex.qty = Math.min(MAX_QTY, ex.qty + qty);
    else merged.push({ id, size, qty: Math.min(MAX_QTY, qty) });
  }
  return merged;
}

function sanitizeFavorites(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return [...new Set(raw.filter((x): x is string => typeof x === "string" && !!getProduct(x)))];
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCart(sanitizeCart(readJSON(CART_KEY)));
    setFavorites(sanitizeFavorites(readJSON(FAV_KEY)));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) writeJSON(CART_KEY, cart);
  }, [cart, loaded]);
  useEffect(() => {
    if (loaded) writeJSON(FAV_KEY, favorites);
  }, [favorites, loaded]);

  const addToCart = (id: string, size: number, qty = 1) =>
    setCart((c) => {
      const ex = c.find((i) => i.id === id && i.size === size);
      if (ex) return c.map((i) => (i === ex ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) } : i));
      return [...c, { id, size, qty: Math.min(MAX_QTY, qty) }];
    });
  const setQty = (id: string, size: number, qty: number) =>
    setCart((c) =>
      qty <= 0
        ? c.filter((i) => !(i.id === id && i.size === size))
        : c.map((i) =>
            i.id === id && i.size === size ? { ...i, qty: Math.min(MAX_QTY, qty) } : i,
          ),
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
