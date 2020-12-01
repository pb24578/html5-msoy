import { IState } from '../../store';

export const getToken = (state: IState) => state.user.session.token;
export const getUserId = (state: IState) => state.user.id;
export const getDisplayName = (state: IState) => state.user.displayName;
