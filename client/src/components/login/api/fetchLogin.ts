import { REST_URI } from '../../../shared/constants';
import { User } from '../../../shared/user/types';

/**
 * Returns a user that logged-in using the provided credentials.
 * The credentials must be correct for it to return a user or
 * it'll throw an error instead.
 *
 * @param email The email to authenticate
 * @param password The password to authenticate
 */
export const fetchLogin = async (email: string, password: string): Promise<User> => {
  const url = `${REST_URI}/login`;
  const body = {
    email,
    password,
  };
  const resp = await fetch(url, {
    body: JSON.stringify(body),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!resp.ok) {
    // return the first error thrown by the server
    const error = await resp.json();
    const errorList: string[] = Object.values(error);
    throw new Error(errorList[0]);
  }

  const data = await resp.json();
  return data;
};
