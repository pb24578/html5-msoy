export default {
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
    params: '/:id',
  },
};

export interface RoomsRoutesProps {
  id?: string;
}
