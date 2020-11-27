import { createAsyncAction } from 'async-selector-kit';
import { actions } from '../../shared/user/reducer';
import { fetchSignup } from './api';

const { setUser } = actions;

export const [signup, loadingSignup, errorSignup] = createAsyncAction({
  id: 'signup',
  async: (store, status) => async (username: string, email: string, password: string) => {
    const user = await fetchSignup(username, email, password);
    store.dispatch(setUser(user));
    return user;
  },
});
