import { REST_URI } from '../../constants';

/**
 * Logs out the session in the REST API.
 */
export const deleteSession = async () => {
  const url = `${REST_URI}/session`;
  await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
