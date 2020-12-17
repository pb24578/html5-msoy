import * as PIXI from 'pixi.js-legacy';
import { AvatarControl } from '../../shared/sdk/world';
import { Profile } from '../profile/types';
import { AvatarPayload } from './avatar/types';

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
