import { createAsyncAction } from 'async-selector-kit';
import { IState } from '../../store';
import { SocketURI } from '../../shared/constants';
import { getToken } from '../../shared/user/selectors';
import { Authenticate, Room } from './types';
import { actions, initialState } from './reducer';

const { setRoom } = actions;

// eslint-disable-next-line max-len
export const [disconnectFromRoom, loadingDisconnectFromRoom, errorDisconnectFromRoom] = createAsyncAction({
  id: 'disconnect-from-room',
  async: (store, status) => async () => {
    const state = store.getState() as IState;
    const { socket } = state.game.room;
    if (socket) {
      socket.close();
    }
    store.dispatch(setRoom(initialState.room));
  },
});

export const [connectToRoom, loadingConnectToRoom, errorConnectToRoom] = createAsyncAction(
  {
    id: 'connect-to-room',
    async: (store, status, token) => async (id: number) => {
      /**
       * Disconnect from the previous room.
       */
      disconnectFromRoom();

      /**
       * Establish a new connection to this room.
       */
      const socket = new WebSocket(`${SocketURI}/room/${id}?token=${token}`);
      const room: Room = {
        id,
        socket,
      };

      store.dispatch(setRoom(room));
    },
  },
  [getToken],
);
