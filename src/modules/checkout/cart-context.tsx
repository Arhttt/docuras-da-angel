'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

export interface CartItem {
  variantId: string;
  productId: string;
  name: string;
  variantLabel: string;
  unitLabel: string;
  priceCents: number;
  quantity: number;
  imageStoragePath?: string;
  minQty: number;
  maxQty: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotalCents: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  isHydrated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'doces_angel_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar carrinho local:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persist cart to localStorage on changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Erro ao salvar carrinho local:', e);
    }
  }, [items, isHydrated]);

  const addItem = (itemToAdd: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems((currentItems) => {
      const existingIndex = currentItems.findIndex((i) => i.variantId === itemToAdd.variantId);
      if (existingIndex > -1) {
        const updated = [...currentItems];
        const current = updated[existingIndex];
        const newQty = Math.min(current.quantity + quantity, itemToAdd.maxQty || 99);
        updated[existingIndex] = { ...current, quantity: newQty };
        return updated;
      }
      const initialQty = Math.max(quantity, itemToAdd.minQty || 1);
      return [...currentItems, { ...itemToAdd, quantity: initialQty }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (variantId: string) => {
    setItems((currentItems) => currentItems.filter((i) => i.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.variantId === variantId) {
          const validatedQty = Math.min(Math.max(quantity, item.minQty || 1), item.maxQty || 99);
          return { ...item, quantity: validatedQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const subtotalCents = useMemo(() => {
    return items.reduce((acc, item) => acc + item.priceCents * item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotalCents,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        isHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
}
