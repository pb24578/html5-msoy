export interface UsersList {
  users: string[];
}

export const isUsersList = (object: any): object is UsersList => 'users' in object;

export interface ChatMessage {
  message: string;
}

export const isChatMessage = (object: any): object is ChatMessage => 'message' in object;
