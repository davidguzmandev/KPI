import { Router } from "express";
import { createRecord } from "../controllers/record.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// POST /api/kpi
router.post("/", requireAuth, createRecord);

export default router;