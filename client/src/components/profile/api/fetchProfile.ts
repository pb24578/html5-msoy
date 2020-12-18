import { REST_URI } from '../../../shared/constants';
import { Profile } from '../types';

/**
 * Returns the profile of a user, or it returns an error if the id does not exist.
 *
 * @param id The profile id of the user to view.
 */
export const fetchProfile = async (id: number): Promise<Profile> => {
  const url = `${REST_URI}/profiles/${id}`;
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
