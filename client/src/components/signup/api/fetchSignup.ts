import { RestURI } from '../../../shared/constants';

interface Authentication {
  token: string;
}

// eslint-disable-next-line max-len
export const fetchSignup = async (username: string, email: string, password: string): Promise<Authentication> => {
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
