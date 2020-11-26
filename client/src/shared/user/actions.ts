import { createAsyncAction } from 'async-selector-kit';
import { fetchLogin } from './api';

const [login, loginLoading, loginError] = createAsyncAction({
  id: 'login',
  async: (store, status) => async () => {
    const user = await fetchLogin('', '');
  },
});
