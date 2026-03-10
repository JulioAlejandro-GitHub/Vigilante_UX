import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator';
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
  isAuthenticated: false, // In a real app, you'd check localStorage/cookies here
  user: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock validation
    if (email === 'admin@vigilante.app' && password === 'admin123') {
      set({
        isAuthenticated: true,
        user: {
          id: '1',
          name: 'Administrador Principal',
          email: 'admin@vigilante.app',
          role: 'admin',
        },
        isLoading: false,
        error: null,
      });
    } else {
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: 'Credenciales inválidas. Por favor, intenta de nuevo.',
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
        role: 'operator',
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
