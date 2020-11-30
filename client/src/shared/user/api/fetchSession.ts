import { LocalStorage, RestURI } from '../../constants';
import { User } from '../types';

/**
 * Returns a user if the user has a valid session
 *
 * @param token The auth token to receive the session from
 */
export const fetchSession = async (token: string): Promise<User> => {
  const url = `${RestURI}/session`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  });

  if (!resp.ok) {
    // remove the session from the local storage
    localStorage.removeItem(LocalStorage.Session);

    // return the first error thrown by the server
    const error = await resp.json();
    const errorList: string[] = Object.values(error);
    throw new Error(errorList[0]);
  }

  const data = await resp.json();
  return data;
};
