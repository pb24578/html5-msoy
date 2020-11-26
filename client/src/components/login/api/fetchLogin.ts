import { RestURI } from '../../../shared/constants';

interface Authentication {
  token: string;
}

export const fetchLogin = async (email: string, password: string): Promise<Authentication> => {
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
    throw new Error(await resp.text());
  }

  const data = await resp.json();
  return data;
};
