import { createAsyncAction } from 'async-selector-kit';
import { LocalStorage } from '../constants';
import { isSession } from './types';
import { actions } from './reducer';
import { fetchUser } from './api';

const { setUser } = actions;

export const [loadUserSession, loadingUserSession, errorLoadUserSession] = createAsyncAction({
  id: 'login',
  async: (store, status) => async () => {
    const localSession = localStorage.getItem(LocalStorage.Session);
    if (localSession) {
      const session = JSON.parse(localSession);
      if (isSession(session) && session.token) {
        // a session exists in the local storage, so load the user using the provided session
        const user = await fetchUser(session.token);
        store.dispatch(setUser(user));
        localStorage.setItem(LocalStorage.Session, JSON.stringify(user.session));
        return user;
      }
    }

    // no valid session exists, so remove the current session storage and return nothing
    localStorage.removeItem(LocalStorage.Session);
    return null;
  },
});
