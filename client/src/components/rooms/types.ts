import { Profile } from '../profile/types';

export interface Room {
  id: number;
  name: string;
  owner: Profile;
}
