import { IState } from '../../store';

export const getDisplayName = (state: IState) => state.user.displayName;
export const getToken = (state: IState) => state.user.session.token;
