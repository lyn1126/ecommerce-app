"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  stock: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((current) => current.productId === item.productId);

          if (existing) {
            return {
              items: state.items.map((current) =>
                current.productId === item.productId
                  ? { ...current, quantity: Math.min(current.quantity + 1, current.stock) }
                  : current,
              ),
            };
          }

          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      updateQty: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (item.productId !== productId) {
              return item;
            }

            const safeQty = Math.max(1, Math.min(quantity, item.stock));
            return { ...item, quantity: safeQty };
          }),
        })),
      clearCart: () => set({ items: [] }),
      total: () =>
        get().items.reduce((sum, item) => {
          return sum + item.price * item.quantity;
        }, 0),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
