import { IState } from '../../store';

export const getUser = (state: IState) => state.user;
export const getSession = (state: IState) => state.user.session;
