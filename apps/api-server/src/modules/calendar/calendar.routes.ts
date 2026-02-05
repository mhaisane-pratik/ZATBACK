import { Router } from "express";
import { CalendarController } from "./calendar.controller";

const router = Router();
const c = new CalendarController();

router.get("/", c.getAll);
router.post("/", c.create);
router.put("/:id", c.update);
router.delete("/:id", c.delete);

export default router;
