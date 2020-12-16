import * as PIXI from 'pixi.js-legacy';
import { Profile } from '../profile/types';
import { AvatarControl } from '../../shared/sdk/world';

export interface World {
  error: WorldError | null;
  pixi: Pixi;
  room: Room;
  socket: WebSocket | null;
}

export interface Pixi {
  app: PIXI.Application;
  stage: PIXI.Container;
  background: PIXI.Sprite;
}

export type ParticipantMap = { [id: number]: Participant };

export interface Room {
  id: number;
  participant: Participant | null;
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
  profile: Profile;
  avatar?: AvatarControl;
}

export const ServerParticipant: Participant = {
  id: 0,
  profile: {
    id: 0,
    redirectRoomId: 1,
    displayName: 'Server',
  },
};

export interface EntityPosition {
  x: number;
  y: number;
  directionX: number;
}

export interface AvatarPayload {
  id: number;
  texture: string;
  script: string;
  position: EntityPosition;
}

export interface ParticipantPayload {
  id: number;
  profile: Profile;
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

export interface ReceiveEntityPosition {
  type: string;
  payload: {
    id: number;
    participantId: number;
    position: EntityPosition;
    animate: boolean;
  };
}

export const isReceiveAvatarPosition = (object: any): object is ReceiveEntityPosition =>
  'type' in object && object.type === 'avatar.position';
