export interface ChatParticipants {
  participants: string[];
}

export const isChatParticipants = (object: any): object is ChatParticipants => 'participants' in object;

export interface ChatMessage {
  message: string;
}

export const isChatMessage = (object: any): object is ChatMessage => 'message' in object;
