export interface AvatarPayload {
  id: number;
  texture: string;
  script: string;
  position: EntityPosition;
}

export interface EntityPosition {
  x: number;
  y: number;
  directionX: number;
}

export interface ReceiveActorPosition {
  type: string;
  payload: {
    participantId: number;
    position: EntityPosition;
    animate: boolean;
  };
}

export const isReceiveAvatarPosition = (object: any): object is ReceiveActorPosition =>
  'type' in object && object.type === 'avatar.position';

export interface ReceiveActorState {
  type: string;
  payload: {
    participantId: number;
    state: string;
  };
}

export const isReceiveAvatarState = (object: any): object is ReceiveActorState =>
  'type' in object && object.type === 'avatar.setState';
