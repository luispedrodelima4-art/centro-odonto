import jwt from 'jsonwebtoken';
import { env } from '../../../../main/config/env.js';
import { ITokenService, UserTokenPayload } from '../../application/services/ITokenService.js';

export class JwtTokenService implements ITokenService {
  private readonly secret = env.JWT_SECRET;
  private readonly expiresIn = '1d';

  public generateAccessToken(payload: UserTokenPayload): string {
    return jwt.sign(
      {
        sub: payload.userId,
        email: payload.email,
        role: payload.role,
        name: payload.name,
      },
      this.secret,
      { expiresIn: this.expiresIn }
    );
  }

  public verifyAccessToken(token: string): UserTokenPayload {
    const decoded = jwt.verify(token, this.secret) as {
      sub: string;
      email: string;
      role: string;
      name: string;
    };

    return {
      userId: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name,
    };
  }
}
