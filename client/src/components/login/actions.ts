import { createAsyncAction } from 'async-selector-kit';
import { actions } from '../../shared/user/reducer';
import { fetchLogin } from './api';

const { setUser } = actions;

export const [login, loadingLogin, errorLogin] = createAsyncAction({
  id: 'login',
  async: (store, status) => async (email: string, password: string) => {
    const user = await fetchLogin(email, password);
    store.dispatch(setUser(user));
    return user;
  },
});
