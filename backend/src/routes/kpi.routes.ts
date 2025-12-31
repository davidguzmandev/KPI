import { Router } from "express";
import { createKpi } from "../controllers/kpi.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// POST /api/kpi
router.post("/", requireAuth, createKpi);

export default router;