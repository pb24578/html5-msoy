interface Participant {
  id: number;
  displayName: string;
}

export interface ChatParticipants {
  participants: Participant[];
}

/**
 * Return if the passed object is a chat participants type.
 *
 * @param object The object to check.
 */
export const isChatParticipants = (object: any): object is ChatParticipants => 'participants' in object;

export interface SendChatMessage {
  message: string;
}

export interface ReceiveChatMessage {
  displayName: string;
  message: string;
}

/**
 * Return if the passed object is a receive chat message type.
 *
 * @param object The object to check.
 */
export const isReceiveChatMessage = (object: any): object is ReceiveChatMessage => 'message' in object;
