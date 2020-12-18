import { createAsyncAction } from 'async-selector-kit';
import { LocalStorage } from '../constants';
import { isSession } from './types';
import { actions, initialState } from './reducer';
import { deleteSession, fetchSession } from './api';

const { setUser } = actions;

export const [logout, loadingLogoutUser, errorLogoutUser] = createAsyncAction({
  id: 'logout',
  async: (store, status) => async () => {
    await deleteSession();
    localStorage.removeItem(LocalStorage.SESSION);
    store.dispatch(setUser(initialState));
  },
});

export const [loadSession, loadingSession, errorLoadSession] = createAsyncAction({
  id: 'load-session',
  async: (store, status) => async () => {
    const localSession = localStorage.getItem(LocalStorage.SESSION);
    if (localSession) {
      const session = JSON.parse(localSession);
      if (isSession(session) && session.token) {
        // a session exists in the local storage, so load the user using the provided session
        const user = await fetchSession(session.token);
        localStorage.setItem(LocalStorage.SESSION, JSON.stringify(user.session));
        store.dispatch(setUser(user));
        return user;
      }
    }

    // no valid session exists, so remove the current session storage and return nothing
    localStorage.removeItem(LocalStorage.SESSION);
    return null;
  },
});
