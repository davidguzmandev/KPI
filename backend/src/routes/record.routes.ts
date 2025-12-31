import { Router } from "express";
import { createRecord, getRecords, getRecordById, updateRecord, deleteRecord } from "../controllers/record.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// POST /api/kpi
router.post("/", requireAuth, createRecord);
router.get("/", requireAuth, getRecords);
router.get("/:id", requireAuth, getRecordById);
router.put("/:id", requireAuth, updateRecord);
router.delete("/:id", requireAuth, deleteRecord);

export default router;