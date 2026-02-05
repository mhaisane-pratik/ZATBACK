import { Request, Response, NextFunction } from "express";

/**
 * Temporary auth middleware
 * (Later replace with JWT)
 */
export function authContext(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  // ⚠️ TEMP: hardcoded (replace with JWT later)
  req.user = {
    id: "11111111-1111-1111-1111-111111111111",
    company_id: "22222222-2222-2222-2222-222222222222",
  };

  next();
}
