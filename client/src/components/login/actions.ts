import { createAsyncAction } from 'async-selector-kit';
import { LocalStorage } from '../../shared/constants';
import { actions } from '../../shared/user/reducer';
import { fetchLogin } from './api';

const { setUser } = actions;

export const [login, loadingLogin, errorLogin] = createAsyncAction({
  id: 'login',
  async: (store, status) => async (email: string, password: string) => {
    const user = await fetchLogin(email, password);
    store.dispatch(setUser(user));
    localStorage.setItem(LocalStorage.Session, JSON.stringify(user.session));
    return user;
  },
});
