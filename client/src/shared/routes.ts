import { createMatchSelector } from 'connected-react-router';
import { match } from 'react-router-dom';

const routes = {
  index: {
    pathname: '/',
  },
  about: {
    pathname: '/about',
  },
  login: {
    pathname: '/login',
  },
  signup: {
    pathname: '/signup',
  },
  profiles: {
    pathname: '/profiles',
    params: '/:id',
  },
  rooms: {
    pathname: '/rooms',
  },
  worlds: {
    pathname: '/worlds',
    params: '/:id',
  },
};

export default routes;

export type WorldsMatch = match<{ id?: string }> | null;
export const getWorldsMatch = createMatchSelector(`${routes.worlds.pathname}${routes.worlds.params}`);

export type ProfilesMatch = match<{ id?: string }> | null;
export const getProfilesMatch = createMatchSelector(`${routes.profiles.pathname}${routes.profiles.params}`);
