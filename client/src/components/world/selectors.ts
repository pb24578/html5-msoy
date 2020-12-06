import { IState } from '../../store';

export const getWorldError = (state: IState) => state.world.error;
export const getParticipants = (state: IState) => state.world.room.participants;
export const getRoomId = (state: IState) => state.world.room.id;
export const getRoomSocket = (state: IState) => state.world.room.socket;
