import React, { useEffect, useState } from 'react';
import { Camera, Search, Activity, AlertTriangle, PlayCircle, Settings, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useCameraStore, CameraData } from '../store/useCameraStore';
import { motion, AnimatePresence } from 'motion/react';
import {
  CamaraUbicacionLabels,
  CamaraEstadoLabels,
  CamaraProtocoloLabels,
  CamaraUbicacion,
  CamaraEstado,
  CamaraProtocolo
} from '../constants/dictionaries';

export default function CamerasPage() {
  const {
    cameras, empresas, sucursales, filters, isLoading, error,
    fetchCameras, fetchEmpresas, fetchSucursales, setFilters, resetFilters,
    createCamera, updateCamera, deleteCamera
  } = useCameraStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState<CameraData | null>(null);
  const [formError, setFormError] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<CameraData>>({
    nombre: '',
    empresa_id: undefined,
    local_id: undefined,
    ubicacion: CamaraUbicacion.ESTADIA,
    estado: CamaraEstado.ACTIVO,
    protocolo: CamaraProtocolo.ONVIF,
    camara_hostname: '',
    camara_port: undefined,
    camara_user: '',
    camara_pass: '',
    stream_url: ''
  });

  useEffect(() => {
    fetchEmpresas();
    fetchCameras();
  }, [fetchEmpresas, fetchCameras]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFilters({ [e.target.name]: e.target.value });
  };

  const handleOpenModal = (camera?: CameraData) => {
    if (camera) {
      setEditingCamera(camera);
      setFormData(camera);
      if (camera.empresa_id) {
        fetchSucursales(camera.empresa_id);
      }
    } else {
      setEditingCamera(null);
      setFormData({
        nombre: '',
        empresa_id: filters.empresa_id ? Number(filters.empresa_id) : undefined,
        local_id: filters.local_id ? Number(filters.local_id) : undefined,
        ubicacion: CamaraUbicacion.ESTADIA,
        estado: CamaraEstado.ACTIVO,
        protocolo: CamaraProtocolo.ONVIF,
        camara_hostname: '',
        camara_port: undefined,
        camara_user: '',
        camara_pass: '',
        stream_url: ''
      });
    }
    setFormError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCamera(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto fetch sucursales when empresa changes in form
    if (name === 'empresa_id') {
      fetchSucursales(value);
      setFormData(prev => ({ ...prev, local_id: undefined })); // Reset sucursal
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      if (editingCamera) {
        await updateCamera(editingCamera.camara_id, formData);
      } else {
        await createCamera(formData);
      }
      handleCloseModal();
    } catch (err: any) {
      setFormError(err?.response?.data?.error || 'Error al guardar la cámara');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta cámara?')) {
      try {
        await deleteCamera(id);
      } catch (err: any) {
        alert(err?.response?.data?.error || err.message || 'Error al eliminar');
      }
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto min-h-screen">
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Cámaras</h1>
          <p className="text-zinc-500 mt-1">Gestión y visualización de la red de cámaras reales conectadas a BD.</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-emerald-500 hover:bg-emerald-600 text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Agregar Cámara
        </button>
      </header>

      {/* FILTERS */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-4 flex flex-wrap items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            name="search"
            placeholder="Buscar por nombre, IP..."
            value={filters.search}
            onChange={handleFilterChange}
            className="bg-black/50 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-64 transition-all"
          />
        </div>

        <select
          name="empresa_id"
          value={filters.empresa_id}
          onChange={handleFilterChange}
          className="bg-black/50 border border-white/5 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          <option value="">Todas las Empresas</option>
          {empresas.map(emp => (
            <option key={emp.empresa_id} value={emp.empresa_id}>{emp.nombre}</option>
          ))}
        </select>

        <select
          name="local_id"
          value={filters.local_id}
          onChange={handleFilterChange}
          disabled={!filters.empresa_id && sucursales.length === 0}
          className="bg-black/50 border border-white/5 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50"
        >
          <option value="">Todas las Sucursales</option>
          {sucursales.map(suc => (
            <option key={suc.local_id} value={suc.local_id}>{suc.nombre}</option>
          ))}
        </select>

        <select
          name="estado"
          value={filters.estado}
          onChange={handleFilterChange}
          className="bg-black/50 border border-white/5 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          <option value="">Todos los Estados</option>
          {Object.entries(CamaraEstadoLabels).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>

        <button
          onClick={resetFilters}
          className="text-sm text-zinc-400 hover:text-white underline decoration-dashed underline-offset-4"
        >
          Limpiar
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 text-red-400 border border-red-500/50 p-4 rounded-xl">
          {error}
        </div>
      )}

      {/* CAMERA GRID */}
      {isLoading ? (
        <div className="text-zinc-500 text-center py-10">Cargando cámaras...</div>
      ) : cameras.length === 0 ? (
        <div className="text-zinc-500 text-center py-10 border border-white/5 rounded-2xl bg-[#111111]">
          No se encontraron cámaras con los filtros actuales.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cameras.map((camera, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={camera.camara_id}
              className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden group hover:border-emerald-500/30 transition-all flex flex-col"
            >
              <div className="relative aspect-video bg-black/50 border-b border-white/5">
                <div className="absolute inset-0 flex items-center justify-center">
                  {camera.estado === 'Activo' ? (
                    <Activity className="w-8 h-8 text-emerald-500/50" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-amber-500/50" />
                  )}
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase px-2 py-1 rounded-md backdrop-blur-md ${
                    camera.estado === 'Activo'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${camera.estado === 'Activo' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    {camera.estado === 'Activo' ? 'LIVE' : 'OFFLINE'}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <span className="bg-black/80 backdrop-blur-md text-zinc-300 text-[10px] px-2 py-1 rounded-md border border-white/10">
                    {camera.empresa_nombre} / {camera.sucursal_nombre}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Camera className="w-4 h-4 text-zinc-400" />
                    <h3 className="text-white font-bold">{camera.nombre}</h3>
                  </div>
                  <div className="text-xs text-zinc-500 space-y-1 mt-2">
                    <p>Host/IP: {camera.camara_hostname || 'N/A'}:{camera.camara_port}</p>
                    <p>Ubicación: {CamaraUbicacionLabels[camera.ubicacion as keyof typeof CamaraUbicacionLabels] || camera.ubicacion}</p>
                    <p>Protocolo: {CamaraProtocoloLabels[camera.protocolo as keyof typeof CamaraProtocoloLabels] || camera.protocolo}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                  <button className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-emerald-400 transition-colors">
                    <PlayCircle className="w-4 h-4" />
                    Ver En Vivo
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenModal(camera)}
                      className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(camera.camara_id)}
                      className="p-1.5 hover:bg-red-500/10 rounded-lg text-zinc-500 hover:text-red-400 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* CREATE/EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={handleCloseModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#111111] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h2 className="text-xl font-bold text-white">
                  {editingCamera ? 'Editar Cámara' : 'Agregar Cámara'}
                </h2>
                <button onClick={handleCloseModal} className="text-zinc-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {formError && (
                  <div className="bg-red-500/20 text-red-400 p-3 rounded-lg text-sm border border-red-500/50">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {/* Empresa */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-400">Empresa *</label>
                    <select
                      name="empresa_id"
                      required
                      value={formData.empresa_id || ''}
                      onChange={handleFormChange}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500/50"
                    >
                      <option value="">Seleccione Empresa</option>
                      {empresas.map(emp => (
                        <option key={emp.empresa_id} value={emp.empresa_id}>{emp.nombre}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sucursal */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-400">Sucursal *</label>
                    <select
                      name="local_id"
                      required
                      disabled={!formData.empresa_id && sucursales.length === 0}
                      value={formData.local_id || ''}
                      onChange={handleFormChange}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50"
                    >
                      <option value="">Seleccione Sucursal</option>
                      {sucursales.map(suc => (
                        <option key={suc.local_id} value={suc.local_id}>{suc.nombre}</option>
                      ))}
                    </select>
                  </div>

                  {/* Nombre */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-400">Nombre de la Cámara *</label>
                    <input
                      type="text"
                      name="nombre"
                      required
                      value={formData.nombre}
                      onChange={handleFormChange}
                      placeholder="Ej: Ingreso Principal"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>

                  {/* Ubicación */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-400">Ubicación</label>
                    <select
                      name="ubicacion"
                      value={formData.ubicacion}
                      onChange={handleFormChange}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500/50"
                    >
                      {Object.entries(CamaraUbicacionLabels).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Estado */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-400">Estado</label>
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleFormChange}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500/50"
                    >
                      {Object.entries(CamaraEstadoLabels).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Protocolo */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-400">Protocolo</label>
                    <select
                      name="protocolo"
                      value={formData.protocolo}
                      onChange={handleFormChange}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500/50"
                    >
                      {Object.entries(CamaraProtocoloLabels).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Hostname/IP */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-400">Hostname / IP</label>
                    <input
                      type="text"
                      name="camara_hostname"
                      value={formData.camara_hostname || ''}
                      onChange={handleFormChange}
                      placeholder="192.168.1.100"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>

                  {/* Puerto */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-400">Puerto</label>
                    <input
                      type="number"
                      name="camara_port"
                      value={formData.camara_port || ''}
                      onChange={handleFormChange}
                      placeholder="554"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>

                  {/* Usuario */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-400">Usuario</label>
                    <input
                      type="text"
                      name="camara_user"
                      value={formData.camara_user || ''}
                      onChange={handleFormChange}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-400">Contraseña</label>
                    <input
                      type="password"
                      name="camara_pass"
                      value={formData.camara_pass || ''}
                      onChange={handleFormChange}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>

                  {/* Stream URL (Opcional) */}
                  <div className="space-y-1 col-span-2">
                    <label className="text-xs font-medium text-zinc-400">Stream URL (RTSP / HTTP)</label>
                    <input
                      type="text"
                      name="stream_url"
                      value={formData.stream_url || ''}
                      onChange={handleFormChange}
                      placeholder="rtsp://usuario:pass@ip:puerto/cam/realmonitor?channel=1&subtype=0"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-emerald-500 hover:bg-emerald-600 text-black px-6 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
