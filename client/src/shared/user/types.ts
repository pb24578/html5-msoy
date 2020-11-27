export type Token = string | null;

export interface Session {
  token: Token;
}

export interface User {
  id: number;
  session: Session;
  displayName: string;
  username: string;
  email: string;
}