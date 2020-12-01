export default {
  index: {
    path: '/',
  },
  login: {
    path: '/login',
  },
  profiles: {
    path: '/profiles',
    params: '/:id',
  },
  rooms: {
    path: '/rooms',
    params: '/:id',
  },
  signup: {
    path: '/signup',
  },
};

export interface RoomsRoutesProps {
  id?: string;
}
