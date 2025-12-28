import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import authRouter from "./routes/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use(morgan("dev"));

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "API KPI funcionando 🚀" });
});

export default app;
