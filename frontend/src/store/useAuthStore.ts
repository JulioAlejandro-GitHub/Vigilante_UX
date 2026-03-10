import { create } from 'zustand';
import { OperadorRol } from '../constants/dictionaries';

interface User {
  id: string;
  name: string;
  email: string;
  role: typeof OperadorRol[keyof typeof OperadorRol];
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch('http://localhost:8085/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión.');
      }

      set({
        isAuthenticated: true,
        user: data.user,
        isLoading: false,
        error: null,
      });

    } catch (err: any) {
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: err.message || 'Error de conexión. Intente nuevamente.',
      });
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    set({
      isAuthenticated: true,
      user: {
        id: '2',
        name: 'Operador de Google',
        email: 'operador@google.com',
        role: OperadorRol.OPERADOR,
      },
      isLoading: false,
      error: null,
    });
  },

  logout: () => {
    set({
      isAuthenticated: false,
      user: null,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));
