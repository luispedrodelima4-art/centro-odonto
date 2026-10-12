export interface UserTokenPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export interface ITokenService {
  generateAccessToken(payload: UserTokenPayload): string;
  verifyAccessToken(token: string): UserTokenPayload;
}
