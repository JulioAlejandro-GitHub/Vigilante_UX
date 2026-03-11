"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const personaController_1 = require("../controllers/personaController");
const router = (0, express_1.Router)();
router.get('/', personaController_1.getPersonas);
exports.default = router;
//# sourceMappingURL=personaRoutes.js.map