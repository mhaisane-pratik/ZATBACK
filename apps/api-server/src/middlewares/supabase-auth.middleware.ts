import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

// 🔐 Supabase client (server-side)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY! // anon key is OK because RLS protects data
);

export const supabaseAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Missing Authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // ✅ Attach user to request
    req.user = {
      id: data.user.id,
      email: data.user.email ?? undefined,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
