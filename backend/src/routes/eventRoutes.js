"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventController_1 = require("../controllers/eventController");
const router = (0, express_1.Router)();
router.get('/', eventController_1.getEvents);
router.put('/:id/subject', eventController_1.updateEventSubject);
router.delete('/:id', eventController_1.deleteEvent);
exports.default = router;
//# sourceMappingURL=eventRoutes.js.map