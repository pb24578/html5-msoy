import { createAsyncAction } from 'async-selector-kit';
import { LocalStorage } from '../../shared/constants';
import { actions } from '../../shared/user/reducer';
import { fetchSignup } from './api';

const { setUser } = actions;

export const [signup, loadingSignup, errorSignup] = createAsyncAction({
  id: 'signup',
  async: (store, status) => async (username: string, email: string, password: string) => {
    const user = await fetchSignup(username, email, password);
    localStorage.setItem(LocalStorage.Session, JSON.stringify(user.session));
    store.dispatch(setUser(user));
    return user;
  },
});
