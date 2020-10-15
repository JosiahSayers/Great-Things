export interface JWT {
  email: string;
  id: string;
  picture?: string;
  name: string;
  iat: number;
  exp: number;
}
