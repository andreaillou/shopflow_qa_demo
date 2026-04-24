import client from './client';
import type { LoginPayload, RegisterPayload, User } from '../types';

export const register = async (
  payload: RegisterPayload
): Promise<{ user: User; token: string }> => {
  const { data } = await client.post<{ user: User; token: string }>('/auth/register', payload);
  return data;
};

export const login = async (payload: LoginPayload): Promise<{ user: User; token: string }> => {
  const { data } = await client.post<{ user: User; token: string }>('/auth/login', payload);
  return data;
};

export const logout = async (): Promise<void> => {
  await client.post('/auth/logout');
};
