import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
enum Role {
  MANAGER = "ADMIN",
  REP = "REP"
}
export type User = {
  id: number;
  name: string;
  email: string;
  password?: string;
  role?: Role;
  company?: string;
  createdAt?: string;
  updatedAt?: string;
};

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
}

// Create the store
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      // Login action
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const base = process.env.NEXT_PUBLIC_API_URL || '';
          const res = await fetch(`${base}/auth/login`, {
            credentials: "include",
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await res.json();

          if (!res.ok) {
            const message = data?.message || 'Login failed';
            set({ isLoading: false, error: message, isAuthenticated: false });
            throw new Error(message);
          }

          const { user, access_token: token } = data;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error?.message || 'Login failed',
            isAuthenticated: false,
          });
          throw error;
        }
      },

      // Register action
      register: async (userData: any) => {
        set({ isLoading: true, error: null });

        try {
          const base = process.env.NEXT_PUBLIC_API_URL || '';

          const res = await fetch(`${base}/users`, {
            credentials: "include",
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          const data = await res.json();

          if (!res.ok) {
            const message = data?.message || 'Registration failed';
            set({ isLoading: false, error: message, isAuthenticated: false });
            throw new Error(message);
          }

          if (data.access_token) {
            set({
              token: data.access_token,
              user: data.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            set({ isLoading: false });
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error?.message || 'Registration failed',
            isAuthenticated: false,
          });
          throw error;
        }
      },

      // Logout action
      logout: async () => {
        try {
          const base = process.env.NEXT_PUBLIC_API_URL || '';
          await fetch(`${base}/auth/logout`, { method: 'POST', credentials: 'include' });
        } catch(e) {}

        // Clear token from store
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });

        // Redirect to login page to clear context
        if (typeof window !== 'undefined') window.location.href = '/auth';
      },

      // Check authentication status
      checkAuth: async () => {
        const { token } = get();

        if (!token) {
          set({ isAuthenticated: false });
          return;
        }

        set({ isLoading: true });

        try {
          const base = process.env.NEXT_PUBLIC_API_URL || '';

          const res = await fetch(`${base}/auth/me`, {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await res.json();

          if (!res.ok) {
            // SalesManager role value
            set({ user: null, token: null, isAuthenticated: false, isLoading: false, error: data?.message || 'Session expired' });
            return;
          }

          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: error?.message || 'Session expired',
          });
        }
      },

      // Update Profile action
      updateProfile: async (userData: Partial<User>) => {
        set({ isLoading: true, error: null });
        const { token } = get();
        try {
          const base = process.env.NEXT_PUBLIC_API_URL || '';
          const res = await fetch(`${base}/users/profile/me`, {
            credentials: "include",
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
          });

          const data = await res.json();

          if (!res.ok) {
            const message = data?.message || 'Profile update failed';
            set({ isLoading: false, error: message });
            throw new Error(message);
          }

          // Update user in state
          set((state) => ({
            user: { ...state.user, ...data } as User,
            isLoading: false,
            error: null,
          }));
        } catch (error: any) {
          set({
            isLoading: false,
            error: error?.message || 'Profile update failed',
          });
          throw error;
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage', // name of the item in localStorage
      partialize: (state) => ({
        // Only persist these fields
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Optional: Create selector hooks for better performance
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);

export default useAuthStore;