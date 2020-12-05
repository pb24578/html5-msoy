import { createAsyncSelectorResults } from 'async-selector-kit';
import { IState } from '../../store';
import { fetchRooms } from './api';
import routes from '../../shared/routes';

export const getRouteChange = (state: IState) => state.router.location;

/**
 * This selector gets updated each time that the route changes, but we only want to
 * showcase the rooms when the rooms tab has been selected. Also, the dependency is
 * necessary since we don't want to memoize the results, so we need to force a change
 * in state to call the API again.
 */
export const [getRooms, isRoomsLoading, getRoomsError] = createAsyncSelectorResults(
  {
    id: 'get-rooms',
    async: async (route) => {
      if (route.pathname !== routes.rooms.pathname) return null;
      const rooms = await fetchRooms();
      return rooms;
    },
    defaultValue: null,
  },
  [getRouteChange],
);
