import client from './client';
import type { Product } from '../types';

export interface ProductQueryParams {
  category?: string;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'name_asc';
  page?: number;
  limit?: number;
}

export const getProducts = async (params?: ProductQueryParams): Promise<Product[]> => {
  const { data } = await client.get<Product[]>('/products', { params });
  return data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const { data } = await client.get<Product>(`/products/${id}`);
  return data;
};
