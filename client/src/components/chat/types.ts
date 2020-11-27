interface Participant {
  id: number;
  displayName: string;
}

export interface ChatParticipants {
  participants: Participant[];
}

export const isChatParticipants = (object: any): object is ChatParticipants => 'participants' in object;

export interface SendChatMessage {
  message: string;
}

export interface ReceiveChatMessage {
  displayName: string;
  message: string;
}

export const isReceiveChatMessage = (object: any): object is ReceiveChatMessage => 'message' in object;
