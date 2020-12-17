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
