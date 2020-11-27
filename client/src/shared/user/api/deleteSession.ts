import { RestURI } from '../../constants';

export const deleteSession = async () => {
  const url = `${RestURI}/session`;
  await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
