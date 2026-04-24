import client from './client';
import type { PromoCode } from '../types';

export const validatePromoCode = async (code: string): Promise<PromoCode> => {
  const { data } = await client.post<PromoCode>('/promo-codes/validate', { code });
  return data;
};
