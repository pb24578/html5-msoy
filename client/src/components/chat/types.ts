export interface Chat {
  messages: ChatMessage[];
}

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

export interface ChatMessage {
  sender: string;
  message: string;
}

export const isReceiveChatMessage = (object: any): object is ReceiveChatMessage =>
  'type' in object && object.type === 'message';
