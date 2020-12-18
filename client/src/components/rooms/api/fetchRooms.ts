import { REST_URI } from '../../../shared/constants';
import { Rooms } from '../types';

/**
 * Returns the relevant rooms.
 */
export const fetchRooms = async (): Promise<Rooms> => {
  const url = `${REST_URI}/rooms`;
  const resp = await fetch(url, {
    method: 'GET',
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
