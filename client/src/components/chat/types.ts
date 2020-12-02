import { Participant } from '../game/types';

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
    sender: Participant;
    message: string;
  };
}

export interface ChatMessage {
  sender: Participant;
  message: string;
  backgroundColor?: string;
}

export const isReceiveChatMessage = (object: any): object is ReceiveChatMessage =>
  'type' in object && object.type === 'message';
