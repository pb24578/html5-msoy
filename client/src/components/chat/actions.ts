import { createAsyncAction } from 'async-selector-kit';
import { getWorldSocket } from '../world/selectors';

export const [sendMessage] = createAsyncAction(
  {
    id: 'send-message',
    async: (store, status, socket) => async (message: string) => {
      if (!socket) return;
      const sendMessage = {
        type: 'message',
        payload: {
          message,
        },
      };
      socket.send(JSON.stringify(sendMessage));
    },
  },
  [getWorldSocket],
);
