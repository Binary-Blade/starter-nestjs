export interface JwtPayload {
  sub: number;
  role: string;
};

export interface JWTTokens {
  token: string;
  refreshToken: string;
}
