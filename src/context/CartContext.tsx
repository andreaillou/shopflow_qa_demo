import { createContext, useEffect, useMemo, useState } from 'react';
import * as cartApi from '../api/cart';
import { validatePromoCode } from '../api/promoCodes';
import { useAuth } from '../hooks/useAuth';
import type { CartItem, PromoCode } from '../types';

interface CartContextValue {
  items: CartItem[];
  promoCode: string | null;
  promoDiscount: number;
  subtotal: number;
  totalAfterDiscount: number;
  itemCount: number;
  addItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  applyPromoCode: (code: string) => Promise<PromoCode>;
  clearCart: () => void;
  refetchCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);

  const refetchCart = async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    const nextItems = await cartApi.getCart();
    setItems(nextItems);
  };

  useEffect(() => {
    if (isAuthenticated) {
      refetchCart().catch(() => undefined);
    } else {
      setItems([]);
      setPromoCode(null);
      setPromoDiscount(0);
    }
  }, [isAuthenticated]);

  const addItem = async (productId: string, quantity: number) => {
    await cartApi.addToCart(productId, quantity);
    await refetchCart();
  };

  const removeItem = async (cartItemId: string) => {
    await cartApi.removeCartItem(cartItemId);
    setItems((previous) => previous.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    const updated = await cartApi.updateCartItem(cartItemId, quantity);
    setItems((previous) => previous.map((item) => (item.id === cartItemId ? updated : item)));
  };

  const applyPromoCode = async (code: string): Promise<PromoCode> => {
    const promo = await validatePromoCode(code);
    setPromoCode(promo.code);
    setPromoDiscount(promo.discount_percent);
    return promo;
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode(null);
    setPromoDiscount(0);
    cartApi.clearCart().catch(() => undefined);
  };

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  const totalAfterDiscount = useMemo(
    () => subtotal - (subtotal * promoDiscount) / 100,
    [promoDiscount, subtotal]
  );

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const value = useMemo(
    () => ({
      items,
      promoCode,
      promoDiscount,
      subtotal,
      totalAfterDiscount,
      itemCount,
      addItem,
      removeItem,
      updateQuantity,
      applyPromoCode,
      clearCart,
      refetchCart,
    }),
    [items, promoCode, promoDiscount, subtotal, totalAfterDiscount, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
