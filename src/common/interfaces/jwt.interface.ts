export interface JwtPayload {
  sub: number;
  role: string;
  version: number;
}

export interface JWTTokens {
  token: string;
  refreshToken: string;
}
