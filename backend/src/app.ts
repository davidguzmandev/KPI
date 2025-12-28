import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "API KPI funcionando 🚀" });
});

export default app;
