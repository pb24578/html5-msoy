interface Participant {
  id: number;
  displayName: string;
}

export interface ChatParticipants {
  type: string;
  payload: {
    participants: Participant[];
  };
}

export const isChatParticipants = (object: any): object is ChatParticipants =>
  'type' in object && object.type === 'participants';

export interface SendChatMessage {
  type: string;
  payload: {
    message: string;
  };
}

export interface ReceiveChatMessage {
  type: string;
  payload: {
    displayName: string;
    message: string;
  };
}

export const isReceiveChatMessage = (object: any): object is ReceiveChatMessage =>
  'type' in object && object.type === 'message';
