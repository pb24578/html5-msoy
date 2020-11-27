import { Token } from '../../shared/user/types';

export interface ChatParticipants {
  participants: string[];
}

/**
 * Return if the passed object is a chat participants type.
 *
 * @param object The object to check.
 */
export const isChatParticipants = (object: any): object is ChatParticipants => 'participants' in object;

export interface ChatMessage {
  token: Token;
  message: string;
}

/**
 * Return if the passed object is a chat message type.
 *
 * @param object The object to check.
 */
export const isChatMessage = (object: any): object is ChatMessage => 'message' in object;
