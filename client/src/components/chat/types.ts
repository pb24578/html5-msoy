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

export interface Exit {
  type: string;
  payload: {
    sender: string;
    reason: string;
  };
}

export const isExit = (object: any): object is Exit => 'type' in object && object.type === 'exit';
