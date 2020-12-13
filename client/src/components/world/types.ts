import * as PIXI from 'pixi.js-legacy';

export interface World {
  error: WorldError | null;
  pixi: Pixi;
  room: Room;
  socket: WebSocket | null;
}

export interface Pixi {
  app: PIXI.Application;
}

export interface Room {
  id: number;
  participants: Participant[];
}

export interface WorldError {
  sender: string;
  reason: string;
}

export interface ConnectionError {
  type: string;
  payload: {
    sender: string;
    reason: string;
  };
}

export const isConnectionError = (object: any): object is ConnectionError =>
  'type' in object && object.type === 'connection.error';

export interface Avatar {
  spritesheet: string;
  texture: string;
  position: EntityPosition;
}

export interface Participant {
  id: number;
  displayName: string;
  avatar?: Avatar;
}

export interface ReceiveParticipants {
  type: string;
  payload: {
    participants: Participant[];
  };
}

export const isReceiveParticipants = (object: any): object is ReceiveParticipants =>
  'type' in object && object.type === 'participants';

export interface EntityPosition {
  id: number;
  x: number;
  y: number;
}

export interface ReceiveEntityPosition {
  type: string;
  payload: EntityPosition;
}

export const isReceiveAvatarPosition = (object: any): object is ReceiveEntityPosition =>
  'type' in object && object.type === 'avatar.position';
