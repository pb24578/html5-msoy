import { createAsyncAction } from 'async-selector-kit';
import { IState } from '../../store';
import { SocketURI } from '../../shared/constants';
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

export const [connectToRoom, loadingConnectToRoom, errorConnectToRoom] = createAsyncAction({
  id: 'connect-to-room',
  async: (store, status) => async (id: number) => {
    /**
     * Disconnect from the previous room.
     */
    disconnectFromRoom();

    /**
     * Establish a new connection to this room.
     */
    const socket = new WebSocket(`${SocketURI}/room/${id}`);
    socket.onopen = () => {
      if (socket) {
        /**
         * Once the web socket connection has been established,
         * send the user's token to authenticate the user in the room.
         */
        const state = store.getState() as IState;
        const authenticate: Authenticate = {
          type: 'authenticate',
          payload: {
            token: state.user.session.token,
          },
        };
        socket.send(JSON.stringify(authenticate));
      }

      const room: Room = {
        id,
        socket,
      };

      store.dispatch(setRoom(room));
    };
  },
});
