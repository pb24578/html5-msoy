import { IState } from '../../store';

export const getMessages = (state: IState) => state.chat.messages;
export const getParticipants = (state: IState) => state.world.room.participants;
