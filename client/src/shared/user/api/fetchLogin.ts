import { RestURI } from '../../constants';
import { User } from '../reducer';

export const fetchLogin = async (email: string, password: string): Promise<User> => {
  const url = `${RestURI}/login`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Email': email,
      'X-Password': password,
    },
  });

  if (!resp.ok) {
    throw new Error(await resp.text());
  }

  const data = await resp.json();
  return data;
};
