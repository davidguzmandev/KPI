import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import authRouter from "./routes/auth.routes";
import kpiRouter from "./routes/kpi.routes";
import { requireAuth } from "./middlewares/auth.middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/kpi", kpiRouter);
app.use(morgan("dev"));

app.get("/api/me", requireAuth, (req, res) => {
  return res.json({ ok: true, user: (req as any).user });
});

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "API KPI funcionando 🚀" });
});

export default app;
