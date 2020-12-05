import { RestURI } from '../../../shared/constants';
import { Room } from '../types';

/**
 * Returns the rooms that are popular or new.
 */
export const fetchRooms = async (): Promise<Room> => {
  const url = `${RestURI}/rooms`;
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
