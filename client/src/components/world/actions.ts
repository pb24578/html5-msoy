import { createAsyncAction } from 'async-selector-kit';
import { SOCKET_URI } from '../../shared/constants';
import { getSession } from '../../shared/user/selectors';
import { getWorldSocket } from './selectors';
import { Room } from './types';
import { actions, initialState } from './reducer';

const { setRoom, setWorldSocket } = actions;

// eslint-disable-next-line max-len
export const [disconnectFromRoom, loadingDisconnectFromRoom, errorDisconnectFromRoom] = createAsyncAction(
  {
    id: 'disconnect-from-room',
    async: (store, status, socket) => async () => {
      if (socket) {
        socket.onclose = null;
        socket.close();
      }
      store.dispatch(setRoom(initialState.room));
      store.dispatch(setWorldSocket(initialState.socket));
    },
  },
  [getWorldSocket],
);

export const [connectToRoom, loadingConnectToRoom, errorConnectToRoom] = createAsyncAction(
  {
    id: 'connect-to-room',
    async: (store, status, { token }) => async (id: number) => {
      /**
       * Disconnect from the previous room.
       */
      disconnectFromRoom();

      /**
       * Establish a new connection to this world's room.
       */
      const socket = new WebSocket(`${SOCKET_URI}/worlds/${id}?token=${token}`);
      const room: Room = {
        ...initialState.room,
        id,
      };

      store.dispatch(setRoom(room));
      store.dispatch(setWorldSocket(socket));
    },
  },
  [getSession],
);
