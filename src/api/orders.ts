import client from './client';
import type { Order, PlaceOrderPayload } from '../types';

export const placeOrder = async (payload: PlaceOrderPayload): Promise<Order> => {
  const { data } = await client.post<Order>('/orders', payload);
  return data;
};
