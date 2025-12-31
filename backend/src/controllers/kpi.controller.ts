import type { Request, Response } from "express";
import { pool } from "../db/pool";

export async function createKpi(req: Request, res: Response) {
  try {
    const {
      date,
      rework,
      level,
      part_number,
      description,
      project,
      of_number,
      total_quantity,
      rejection_quantity,
      scrap_quantity,
      responsable,
      causes,
      comments,
      operator,
      inspector,
    } = req.body;

    // Validación mínima (campos obligatorios reales)
    if (
      !date ||
      typeof rework !== "boolean" ||
      total_quantity == null ||
      rejection_quantity == null ||
      scrap_quantity == null
    ) {
      return res.status(400).json({
        ok: false,
        error: "Campos obligatorios faltantes",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO kpi (
        date,
        rework,
        level,
        part_number,
        description,
        project,
        of_number,
        total_quantity,
        rejection_quantity,
        scrap_quantity,
        responsable,
        causes,
        comments,
        operator,
        inspector,
        created_at,
        updated_at
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,
        $8,$9,$10,
        $11,$12,$13,$14,$15,
        NOW(), NOW()
      )
      RETURNING *
      `,
      [
        date,
        rework,
        level,
        part_number,
        description,
        project,
        of_number,
        total_quantity,
        rejection_quantity,
        scrap_quantity,
        responsable,
        causes,
        comments,
        operator,
        inspector,
      ]
    );

    return res.status(201).json({
      ok: true,
      record: result.rows[0],
    });
  } catch (error) {
    console.error("CREATE KPI ERROR:", error);
    return res.status(500).json({
      ok: false,
      error: "Error guardando KPI",
    });
  }
}
