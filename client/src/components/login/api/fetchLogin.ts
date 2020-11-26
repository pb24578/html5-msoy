import { RestURI } from '../../../shared/constants';

interface Authentication {
  token: string;
}

export const fetchLogin = async (email: string, password: string): Promise<Authentication> => {
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
