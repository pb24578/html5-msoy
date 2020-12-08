import { createAsyncAction } from 'async-selector-kit';
import { IState } from '../../store';
import { SocketURI } from '../../shared/constants';
import { getSession } from '../../shared/user/selectors';
import { Room } from './types';
import { actions, initialState } from './reducer';

const { setRoom, setWorldSocket } = actions;

// eslint-disable-next-line max-len
export const [disconnectFromRoom, loadingDisconnectFromRoom, errorDisconnectFromRoom] = createAsyncAction({
  id: 'disconnect-from-room',
  async: (store, status) => async () => {
    const state = store.getState() as IState;
    const { socket } = state.world;
    if (socket) {
      socket.onclose = null;
      socket.close();
    }
    store.dispatch(setRoom(initialState.room));
    store.dispatch(setWorldSocket(initialState.socket));
  },
});

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
      const socket = new WebSocket(`${SocketURI}/worlds/${id}?token=${token}`);
      const room: Room = {
        id,
        participants: [],
      };

      store.dispatch(setRoom(room));
      store.dispatch(setWorldSocket(socket));
    },
  },
  [getSession],
);
