export interface Room {
  id: number;
  participants: Participant[];
  socket: WebSocket | null;
}

export interface Game {
  room: Room;
}

export interface ConnectionError {
  type: string;
  payload: {
    sender: string;
    reason: string;
  };
}

export const isConnectionError = (object: any): object is ConnectionError =>
  'type' in object && object.type === 'client.error';

export interface Participant {
  id: number;
  displayName: string;
}

export interface ReceiveParticipants {
  type: string;
  payload: {
    participants: Participant[];
  };
}

export const isReceiveParticipants = (object: any): object is ReceiveParticipants =>
  'type' in object && object.type === 'participants';
