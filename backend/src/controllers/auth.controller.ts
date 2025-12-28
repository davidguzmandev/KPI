import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool";

export async function login(req: Request, res: Response) {
  try {
    // 1) Tomar datos del body
    const { email, password } = req.body as { email?: string; password?: string };

    // 2) Validación mínima (sin librerías todavía)
    if (!email || !password) {
      return res.status(400).json({ ok: false, error: "email y password son requeridos" });
    }

    // 3) Buscar el usuario por email
    const result = await pool.query(
      `
      SELECT id, name, email, password, role
      FROM users
      WHERE email = $1
      LIMIT 1
      `,
      [email.toLowerCase()]
    );

    const user = result.rows[0];

    // 4) Si no existe, error genérico (no dar pistas)
    if (!user) {
      return res.status(401).json({ ok: false, error: "Credenciales inválidas" });
    }

    // 5) Comparar password (DB debe guardar password hasheado con bcrypt)
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ ok: false, error: "Credenciales inválidas" });
    }

    // 6) Crear token (para "entrar" a la app)
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return res.status(500).json({ ok: false, error: "JWT_SECRET no configurado" });
    }

    const token = jwt.sign(
      { sub: user.id, role: user.role }, // payload mínimo
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    // 7) Responder sin el password
    return res.json({
      ok: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ ok: false, error: "Error interno" });
  }
}
