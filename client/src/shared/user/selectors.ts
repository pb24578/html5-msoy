import { createSelector } from 'async-selector-kit';
import { IState } from '../../store';
import { LocalStorage } from '../constants';

export const getUser = (state: IState) => state.user;
export const getSession = (state: IState) => state.user.session;

/**
 * Returns if the user's session state is loaded. Note that this will return
 * true if there is no session in the local storage.
 */
export const isSessionLoaded = createSelector(getSession, (session) => {
  const sessionStored = localStorage.getItem(LocalStorage.SESSION);
  if (!sessionStored) {
    /**
     * Returns true if there is no session stored in local storage since
     * having no session stored means the same thing as the session being
     * already loaded.
     */
    return true;
  }
  return Boolean(session.token);
});
