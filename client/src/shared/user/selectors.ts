import { IState } from '../../store';

export const getToken = (state: IState) => state.user.session.token;
