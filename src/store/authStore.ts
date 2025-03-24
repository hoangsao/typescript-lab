import { create } from 'zustand';
import { AuthorizedUser } from '../api/auth/AuthorizedUser';

interface AuthState {
  isLoggedIn: boolean;
  user: AuthorizedUser | null;
  login: (user: AuthorizedUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  login: (user: AuthorizedUser) => set({ isLoggedIn: true, user }),
  logout: () => set({ isLoggedIn: false, user: null }),
}));