import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { pool } from "./db/pool";

const app = express();

// Middlewares básicos
app.use(cors());              // Permite requests desde otros orígenes (frontend)
app.use(express.json());      // Parsear JSON en req.body
app.use(morgan("dev"));       // Logs HTTP en consola

// Ruta simple para probar que el servidor responde
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "API KPI funcionando 🚀" });
});

// Ruta para probar conexión con la DB
app.get("/health/db", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      ok: true,
      dbTime: result.rows[0].now,
    });
  } catch (error) {
    console.error("Error conectando a la DB:", error);
    res.status(500).json({ ok: false, error: "Error conectando a la DB" });
  }
});

// Levantar servidor
const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  console.log(`✅ Backend KPI escuchando en http://localhost:${PORT}`);
});
