import type { Request, Response } from "express";
import { pool } from "../db/pool";

export async function createRecord(req: Request, res: Response) {
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
        error: "Missing required fields",
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
    console.error("CREATE RECORD ERROR:", error);
    return res.status(500).json({
      ok: false,
      error: "Error creating record",
    });
  }
}

export async function getRecords(_req: Request, res: Response) {
  const result = await pool.query(
    "SELECT * FROM kpi ORDER BY date DESC, created_at DESC"
  );
  res.json({ ok: true, records: result.rows });
}

export async function getRecordById(req: Request, res: Response) {
  const { id } = req.params;
  const result = await pool.query("SELECT * FROM kpi WHERE id = $1", [id]);

  if (!result.rows[0]) {
    return res.status(404).json({ ok: false, error: "Record no encontrado" });
  }

  res.json({ ok: true, record: result.rows[0] });
}

export async function updateRecord(req: Request, res: Response) {
  const { id } = req.params;

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

  const result = await pool.query(
    `
    UPDATE kpi SET
      date = $1,
      rework = $2,
      level = $3,
      part_number = $4,
      description = $5,
      project = $6,
      of_number = $7,
      total_quantity = $8,
      rejection_quantity = $9,
      scrap_quantity = $10,
      responsable = $11,
      causes = $12,
      comments = $13,
      operator = $14,
      inspector = $15,
      updated_at = NOW()
    WHERE id = $16
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
      id,
    ]
  );

  if (!result.rows[0]) {
    return res.status(404).json({ ok: false, error: "Record no encontrado" });
  }

  res.json({ ok: true, record: result.rows[0] });
}

export async function deleteRecord(req: Request, res: Response) {
  const { id } = req.params;

  const result = await pool.query(
    "DELETE FROM kpi WHERE id = $1 RETURNING id",
    [id]
  );

  if (!result.rows[0]) {
    return res.status(404).json({ ok: false, error: "Record no encontrado" });
  }

  res.json({ ok: true, id });
}