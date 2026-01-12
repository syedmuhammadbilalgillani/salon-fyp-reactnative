import { create } from "zustand";
import { UserType } from "../types";

type User = {
  id?: string;
  name?: string;
  email?: string;
  role?: UserType;
  [key: string]: any;
} | null;

type AuthState = {
  isAuthenticated: boolean;
  isGuest: boolean;
  token: string | null;
  user: User;
  login: (token: string) => void;
  loginAsGuest: () => void;
  logout: () => void;
  setUser: (user: User) => void;
  getUser: () => User;
  canAccessGuestProtectedRoute: () => boolean;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isGuest: false,
  token: null,
  user: null,
  login: (token) =>
    set(() => ({
      isAuthenticated: true,
      isGuest: false,
      token,
    })),
  loginAsGuest: () =>
    set(() => ({
      isAuthenticated: true,
      isGuest: true,
      token: null, // No token for guest mode
    })),
  logout: () =>
    set(() => ({
      isAuthenticated: false,
      isGuest: false,
      token: null,
      user: null,
    })),
  setUser: (user) =>
    set(() => ({
      user,
    })),
  getUser: () => {
    return get().user;
  },
  canAccessGuestProtectedRoute: () => {
    const { isAuthenticated, isGuest } = get();
    return isAuthenticated && !isGuest; // Authenticated users only
  },
}));