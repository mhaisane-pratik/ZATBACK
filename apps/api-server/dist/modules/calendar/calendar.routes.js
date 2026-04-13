"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const calendar_controller_1 = require("./calendar.controller");
const router = (0, express_1.Router)();
const c = new calendar_controller_1.CalendarController();
router.get("/", c.getAll);
router.post("/", c.create);
router.put("/:id", c.update);
router.delete("/:id", c.delete);
exports.default = router;
//# sourceMappingURL=calendar.routes.js.map