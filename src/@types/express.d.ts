declare namespace Express {
  export interface Request {
    auth?: {
      id: string;
      username: string;
      iat: number | undefined;
      exp: number | undefined;
    }
  }
}
