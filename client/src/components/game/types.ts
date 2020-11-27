import { Token } from '../../shared/user/types';

export interface Authenticate {
  type: string;
  payload: {
    token: Token;
  };
}

export interface Room {
  id: number;
  socket: WebSocket | null;
}

export interface Game {
  room: Room;
}
