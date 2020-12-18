import { createAsyncAction } from 'async-selector-kit';
import sha256 from 'crypto-js/sha256';
import { LocalStorage } from '../../shared/constants';
import { actions } from '../../shared/user/reducer';
import { fetchSignup } from './api';

const { setUser } = actions;

export const [signup, loadingSignup, errorSignup] = createAsyncAction({
  id: 'signup',
  async: (store, status) => async (username: string, email: string, password: string) => {
    const hashedPassword = sha256(password).toString();
    const user = await fetchSignup(username, email, hashedPassword);
    localStorage.setItem(LocalStorage.SESSION, JSON.stringify(user.session));
    store.dispatch(setUser(user));
    return user;
  },
});
