import { RestURI } from '../../../shared/constants';

interface Authentication {
  token: string;
}

// eslint-disable-next-line max-len
export const fetchSignup = async (username: string, email: string, password: string): Promise<Authentication> => {
  const url = `${RestURI}/login`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Username': username,
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
