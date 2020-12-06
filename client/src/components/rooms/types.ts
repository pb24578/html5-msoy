import { Profile } from '../profile/types';

export interface Room {
  id: number;
  name: string;
  online: number;
  owner: Profile;
}

export interface Rooms {
  active: Room[];
  new: Room[];
  featured: Room[];
}
