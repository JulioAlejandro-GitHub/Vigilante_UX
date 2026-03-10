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
