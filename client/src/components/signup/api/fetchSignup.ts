import { RestURI } from '../../../shared/constants';
import { User } from '../../../shared/user/types';

/**
 * Creates and returns a new user using the provided credentials.
 * If it fails to signup, then it will throw an error instead.
 *
 * @param username The username to signup
 * @param email The email to signup
 * @param password The password to signup
 */
// eslint-disable-next-line max-len
export const fetchSignup = async (username: string, email: string, password: string): Promise<User> => {
  const url = `${RestURI}/signup`;
  const body = {
    username,
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
