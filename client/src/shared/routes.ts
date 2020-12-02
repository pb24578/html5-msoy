export default {
  index: {
    path: '/',
  },
  about: {
    path: '/about',
  },
  login: {
    path: '/login',
  },
  signup: {
    path: '/signup',
  },
  profiles: {
    path: '/profiles',
    params: '/:id',
  },
  rooms: {
    path: '/rooms',
    params: '/:id',
  },
};

export interface RoomsRoutesProps {
  id?: string;
}
