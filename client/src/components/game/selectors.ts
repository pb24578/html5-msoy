import { IState } from '../../store';

export const getRoomSocket = (state: IState) => state.game.room.socket;
