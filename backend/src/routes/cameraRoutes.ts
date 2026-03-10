import { Router } from 'express';
import {
  getCameras,
  getCameraById,
  createCamera,
  updateCamera,
  deleteCamera,
  getEmpresas,
  getSucursales
} from '../controllers/cameraController';

const router = Router();

// Helper endpoints
router.get('/empresas', getEmpresas);
router.get('/sucursales', getSucursales);

// CRUD for Cameras
router.get('/', getCameras);
router.get('/:id', getCameraById);
router.post('/', createCamera);
router.put('/:id', updateCamera);
router.delete('/:id', deleteCamera);

export default router;
