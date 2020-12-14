import { createAsyncAction } from 'async-selector-kit';
import { replace } from 'connected-react-router';
import routes from '../../shared/routes';
import { getRoomId } from '../world/selectors';

export const [closeMenu] = createAsyncAction(
  {
    id: 'close-menu',
    async: (store, status, roomId) => async () => {
      if (roomId) {
        store.dispatch(replace(`${routes.worlds.pathname}/${roomId}`));
      }
    },
  },
  [getRoomId],
);
