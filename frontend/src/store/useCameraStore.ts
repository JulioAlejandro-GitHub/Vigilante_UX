import { create } from 'zustand';
import { camerasApi } from '../lib/api';

export interface Empresa {
  empresa_id: number;
  nombre: string;
  estado: string;
}

export interface Sucursal {
  local_id: number;
  empresa_id: number;
  nombre: string;
  estado: string;
}

export interface CameraData {
  camara_id: number;
  local_id: number;
  nombre: string;
  ubicacion: string;
  estado: string;
  orden?: number;
  protocolo: string;
  camara_hostname?: string;
  camara_port?: number;
  camara_user?: string;
  camara_pass?: string;
  camara_params?: string;
  stream_url?: string;
  created_at: string;
  updated_at: string;
  sucursal_nombre?: string;
  empresa_id?: number;
  empresa_nombre?: string;
}

interface CameraFilters {
  search: string;
  empresa_id: string;
  local_id: string;
  estado: string;
  protocolo: string;
}

interface CameraState {
  cameras: CameraData[];
  empresas: Empresa[];
  sucursales: Sucursal[];
  filters: CameraFilters;
  isLoading: boolean;
  error: string | null;

  setFilters: (filters: Partial<CameraFilters>) => void;
  resetFilters: () => void;

  fetchCameras: () => Promise<void>;
  fetchEmpresas: () => Promise<void>;
  fetchSucursales: (empresaId?: number | string) => Promise<void>;

  createCamera: (data: Partial<CameraData>) => Promise<void>;
  updateCamera: (id: number, data: Partial<CameraData>) => Promise<void>;
  deleteCamera: (id: number) => Promise<void>;
}

const initialFilters: CameraFilters = {
  search: '',
  empresa_id: '',
  local_id: '',
  estado: '',
  protocolo: '',
};

export const useCameraStore = create<CameraState>((set, get) => ({
  cameras: [],
  empresas: [],
  sucursales: [],
  filters: initialFilters,
  isLoading: false,
  error: null,

  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));
    get().fetchCameras();

    // Auto-fetch sucursales if empresa filter changes
    if (newFilters.empresa_id !== undefined) {
      if (newFilters.empresa_id === '') {
        set({ sucursales: [] });
      } else {
        get().fetchSucursales(newFilters.empresa_id);
      }
    }
  },

  resetFilters: () => {
    set({ filters: initialFilters, sucursales: [] });
    get().fetchCameras();
  },

  fetchCameras: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      // Clean up empty filters
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );
      const cameras = await camerasApi.getAll(params);
      set({ cameras, isLoading: false });
    } catch (err: any) {
      set({ error: err?.response?.data?.error || err.message, isLoading: false });
    }
  },

  fetchEmpresas: async () => {
    try {
      const empresas = await camerasApi.getEmpresas();
      set({ empresas });
    } catch (err: any) {
      console.error('Failed to fetch empresas', err);
    }
  },

  fetchSucursales: async (empresaId?: number | string) => {
    try {
      const sucursales = await camerasApi.getSucursales(empresaId);
      set({ sucursales });
    } catch (err: any) {
      console.error('Failed to fetch sucursales', err);
    }
  },

  createCamera: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await camerasApi.create(data);
      await get().fetchCameras();
    } catch (err: any) {
      set({ error: err?.response?.data?.error || err.message, isLoading: false });
      throw err;
    }
  },

  updateCamera: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await camerasApi.update(id, data);
      await get().fetchCameras();
    } catch (err: any) {
      set({ error: err?.response?.data?.error || err.message, isLoading: false });
      throw err;
    }
  },

  deleteCamera: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await camerasApi.delete(id);
      await get().fetchCameras();
    } catch (err: any) {
      set({ error: err?.response?.data?.error || err.message, isLoading: false });
      throw err; // Re-throw to handle error in UI components
    }
  },
}));
