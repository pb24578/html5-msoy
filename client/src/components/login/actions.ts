import { createAsyncAction } from 'async-selector-kit';
import sha256 from 'crypto-js/sha256';
import { LocalStorage, Salt } from '../../shared/constants';
import { actions } from '../../shared/user/reducer';
import { fetchLogin } from './api';

const { setUser } = actions;

export const [login, loadingLogin, errorLogin] = createAsyncAction({
  id: 'login',
  async: (store, status) => async (email: string, password: string) => {
    const hashedPassword = sha256(password + Salt).toString();
    const user = await fetchLogin(email, hashedPassword);
    localStorage.setItem(LocalStorage.Session, JSON.stringify(user.session));
    store.dispatch(setUser(user));
    return user;
  },
});
