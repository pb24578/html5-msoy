import { RestURI } from '../../../shared/constants';
import { User } from '../../../shared/user/types';

export const fetchLogin = async (email: string, password: string): Promise<User> => {
  const url = `${RestURI}/login`;
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
