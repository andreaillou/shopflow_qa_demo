import { createContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/auth";
import type { LoginPayload, RegisterPayload, User } from "../types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  register: (payload: RegisterPayload) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

const parseStoredUser = (value: string | null): User | null => {
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value) as User;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    const storedUser = parseStoredUser(sessionStorage.getItem("user"));
    if (storedToken) {
      setToken(storedToken);
      setUser(storedUser);
    }
  }, []);

  const login = async (payload: LoginPayload) => {
    const result = await authApi.login(payload);
    sessionStorage.setItem("token", result.token);
    sessionStorage.setItem("user", JSON.stringify(result.user));
    setToken(result.token);
    setUser(result.user);
  };

  const register = async (payload: RegisterPayload) => {
    const result = await authApi.register(payload);
    sessionStorage.setItem("token", result.token);
    sessionStorage.setItem("user", JSON.stringify(result.user));
    setToken(result.token);
    setUser(result.user);
  };

  const logout = () => {
    authApi.logout().catch(() => undefined);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
      register,
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
