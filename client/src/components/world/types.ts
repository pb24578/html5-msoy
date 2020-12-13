import * as PIXI from 'pixi.js-legacy';
import { AvatarControl } from '../../shared/sdk/world';

export interface World {
  error: WorldError | null;
  pixi: Pixi;
  room: Room;
  socket: WebSocket | null;
}

export interface Pixi {
  app: PIXI.Application;
}

export type ParticipantMap = { [id: number]: Participant };

export interface Room {
  id: number;
  participantMap: ParticipantMap;
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

export interface Participant {
  id: number;
  displayName: string;
  avatar?: AvatarControl;
}

export interface AvatarPayload {
  id: number;
  texture: string;
  script: string;
  position: EntityPosition;
}

export interface ParticipantPayload {
  id: number;
  displayName: string;
  avatar: AvatarPayload;
}

export interface ReceiveParticipants {
  type: string;
  payload: {
    participants: ParticipantPayload[];
  };
}

export const isReceiveParticipants = (object: any): object is ReceiveParticipants =>
  'type' in object && object.type === 'participants';

export interface EntityPosition {
  id: number;
  x: number;
  y: number;
}

export interface SendEntityPosition {
  type: string;
  payload: EntityPosition;
}

export interface ReceiveEntityPosition {
  type: string;
  payload: EntityPosition;
}

export const isReceiveAvatarPosition = (object: any): object is ReceiveEntityPosition =>
  'type' in object && object.type === 'avatar.position';
