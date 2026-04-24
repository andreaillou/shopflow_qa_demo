import client from './client';
import type { CartItem } from '../types';

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const getCart = async (): Promise<CartItem[]> => {
  const { data } = await client.get<CartItem[]>('/cart');
  return data;
};

export const addToCart = async (productId: string, quantity: number): Promise<CartItem> => {
  const { data } = await client.post<CartItem>('/cart', { product_id: productId, quantity });
  return data;
};

export const updateCartItem = async (cartItemId: string, quantity: number): Promise<CartItem> => {
  await wait(600);
  const { data } = await client.patch<CartItem>(`/cart/${cartItemId}`, { quantity });
  return data;
};

export const removeCartItem = async (cartItemId: string): Promise<void> => {
  await client.delete(`/cart/${cartItemId}`);
};

export const clearCart = async (): Promise<void> => {
  await client.delete('/cart');
};
