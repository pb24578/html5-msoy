import { RestURI } from '../../constants';

/**
 * Logs out the session in the REST API.
 */
export const deleteSession = async () => {
  const url = `${RestURI}/session`;
  await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
