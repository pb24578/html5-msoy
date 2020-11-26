import { IState } from '../../store';

export const getToken = (state: IState) => state.session.token;
