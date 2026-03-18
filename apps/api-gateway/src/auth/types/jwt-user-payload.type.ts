export type JwtUserPayload = {
  sub: string;
  username: string;
  roles: string[];
  iat?: number;
  exp?: number;
};
