import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8085/api',
  withCredentials: true,
});

export default api;

// Cameras Service
export const camerasApi = {
  getAll: async (params?: any) => {
    const response = await api.get('/cameras', { params });
    return response.data;
  },
  getById: async (id: number | string) => {
    const response = await api.get(`/cameras/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/cameras', data);
    return response.data;
  },
  update: async (id: number | string, data: any) => {
    const response = await api.put(`/cameras/${id}`, data);
    return response.data;
  },
  delete: async (id: number | string) => {
    const response = await api.delete(`/cameras/${id}`);
    return response.data;
  },
  getEmpresas: async () => {
    const response = await api.get('/cameras/empresas');
    return response.data;
  },
  getSucursales: async (empresaId?: number | string) => {
    const params = empresaId ? { empresa_id: empresaId } : undefined;
    const response = await api.get('/cameras/sucursales', { params });
    return response.data;
  }
};

// Events Service
export const eventsApi = {
  getAll: async (params?: { page?: number; limit?: number; search?: string; type?: string }) => {
    const response = await api.get('/events', { params });
    return response.data;
  },
  updateSubject: async (id: number | string, data: { assigned_persona_id: number | string, final_label?: string }) => {
    const response = await api.put(`/events/${id}/subject`, data);
    return response.data;
  },
  delete: async (id: number | string) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  }
};

// Personas Service
export const personasApi = {
  getAll: async () => {
    const response = await api.get('/personas');
    return response.data;
  }
};

// Dashboard Service
export const dashboardApi = {
  getDashboardSummary: async (limit = 10) => {
    const response = await api.get('/dashboard/summary', { params: { limit } });
    return response.data;
  }
};
