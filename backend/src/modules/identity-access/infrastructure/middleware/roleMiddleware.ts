import { NextFunction, Request, Response } from 'express';
import { UserRoleType } from '../../domain/value-objects/UserRole.js';

export function requireRoles(...allowedRoles: UserRoleType[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required before checking permissions.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role as UserRoleType)) {
      res.status(403).json({
        error: 'Forbidden',
        message: `Access denied. Required one of roles: [${allowedRoles.join(', ')}]. Current role: ${req.user.role}`,
      });
      return;
    }

    next();
  };
}
