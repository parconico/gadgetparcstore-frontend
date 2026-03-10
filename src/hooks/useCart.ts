'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, Currency } from '@/types';
import { getPrice } from '@/lib/currency';

interface CartStore {
  items: CartItem[];
  currency: Currency;
  setCurrency: (c: Currency) => void;
  addItem: (product: Product, quantity?: number, variantId?: string, variantTitle?: string) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      currency: 'USD',

      setCurrency: (currency) => set({ currency }),

      addItem: (product, quantity = 1, variantId, variantTitle) => {
        const vid = variantId || product.variantId;
        const vtitle = variantTitle || 'Default';
        const items = get().items;
        const existing = items.find((i) => i.variantId === vid);

        if (existing) {
          set({
            items: items.map((i) =>
              i.variantId === vid
                ? { ...i, quantity: i.quantity + quantity }
                : i,
            ),
          });
        } else {
          const variant = product.variants.find((v) => v.id === vid);
          const itemProduct = variant
            ? { ...product, priceUSD: variant.priceUSD, compareAtPrice: variant.compareAtPrice }
            : product;

          set({
            items: [...items, { product: itemProduct, quantity, variantId: vid, variantTitle: vtitle }],
          });
        }
      },

      removeItem: (variantId) => {
        set({ items: get().items.filter((i) => i.variantId !== variantId) });
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.variantId === variantId ? { ...i, quantity } : i,
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        const { items, currency } = get();
        return items.reduce(
          (sum, item) => sum + getPrice(item.product, currency) * item.quantity,
          0,
        );
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    { name: 'gadgetparc-cart' },
  ),
);
