import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type JwtPayload = {
  sub: string;   // user id
  role: string;  // role
  iat: number;
  exp: number;
};

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  // Espera: "Bearer <token>"
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ ok: false, error: "Token requerido" });
  }

  const token = header.slice("Bearer ".length).trim();
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ ok: false, error: "JWT_SECRET no configurado" });
  }

  try {
    const payload = jwt.verify(token, secret) as JwtPayload;

    // Guardamos info útil en req para usarla en endpoints
    (req as any).user = { id: payload.sub, role: payload.role };

    return next();
  } catch {
    return res.status(401).json({ ok: false, error: "Token inválido o expirado" });
  }
}
