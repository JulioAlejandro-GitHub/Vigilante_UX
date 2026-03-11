"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cameraController_1 = require("../controllers/cameraController");
const router = (0, express_1.Router)();
// Helper endpoints
router.get('/empresas', cameraController_1.getEmpresas);
router.get('/sucursales', cameraController_1.getSucursales);
// CRUD for Cameras
router.get('/', cameraController_1.getCameras);
router.get('/:id', cameraController_1.getCameraById);
router.post('/', cameraController_1.createCamera);
router.put('/:id', cameraController_1.updateCamera);
router.delete('/:id', cameraController_1.deleteCamera);
exports.default = router;
//# sourceMappingURL=cameraRoutes.js.map