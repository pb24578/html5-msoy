import { IState } from '../../store';

export const getMessages = (state: IState) => state.chat.messages;
