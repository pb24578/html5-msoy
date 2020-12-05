import { Profile } from '../profile/types';

export interface Room {
  id: number;
  name: string;
  owner: Profile;
}

export interface Rooms {
  active: Room[];
  new: Room[];
  featured: Room[];
}
