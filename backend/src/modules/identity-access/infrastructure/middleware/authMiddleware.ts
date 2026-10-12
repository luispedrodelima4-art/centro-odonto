import { NextFunction, Request, Response } from 'express';
import { UserTokenPayload } from '../../application/services/ITokenService.js';
import { JwtTokenService } from '../services/JwtTokenService.js';

declare global {
  namespace Express {
    interface Request {
      user?: UserTokenPayload | undefined;
    }
  }
}

const tokenService = new JwtTokenService();

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication token missing or invalid format.',
    });
    return;
  }

  const token = authHeader.substring(7);

  try {
    const payload = tokenService.verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (_error) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired access token.',
    });
  }
}
