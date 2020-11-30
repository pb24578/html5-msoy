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
    sender: string;
    message: string;
  };
}

export const isReceiveChatMessage = (object: any): object is ReceiveChatMessage =>
  'type' in object && object.type === 'message';

export interface Kick {
  type: string;
  payload: {
    sender: string;
    reason: string;
  };
}

export const isKick = (object: any): object is Kick => 'type' in object && object.type === 'kick';
