export type Token = string | null;

export interface Session {
  token: Token;
}

export const isSession = (object: any): object is Session => 'token' in object;

export interface User {
  id: number;
  rootRoomId: number;
  session: Session;
  displayName: string;
  username: string;
  email: string;
}
