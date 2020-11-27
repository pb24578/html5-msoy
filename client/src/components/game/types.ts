export interface Room {
  id: number;
  socket: WebSocket | null;
}

export interface Game {
  room: Room;
}