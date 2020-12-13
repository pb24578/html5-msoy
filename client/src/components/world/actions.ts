import { createAsyncAction } from 'async-selector-kit';
import * as PIXI from 'pixi.js-legacy';
import { IState } from '../../store';
import { SocketURI } from '../../shared/constants';
import { getSession } from '../../shared/user/selectors';
import { AvatarControl } from '../../shared/sdk/world';
import { getWorldSocket, getParticipantMap } from './selectors';
import { EntityPosition, ParticipantMap, ParticipantPayload, Room } from './types';
import { actions, initialState } from './reducer';

const { setParticipantMap: updateParticipantMap, setRoom, setWorldSocket } = actions;

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
      const socket = new WebSocket(`${SocketURI}/worlds/${id}?token=${token}`);
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

export const [setParticipantMap] = createAsyncAction(
  {
    id: 'set-participant-map',
    async: (store, status, participantMap) => async (participants: ParticipantPayload[]) => {
      participants.forEach(({ avatar }) => {
        if (avatar && !PIXI.Loader.shared.resources[avatar.texture]) {
          PIXI.Loader.shared.add(avatar.texture);
        }
      });

      PIXI.Loader.shared.load(() => {
        const newParticipantMap: ParticipantMap = {};
        participants.forEach((participant) => {
          const existingParticipant = participantMap[participant.id];
          if (existingParticipant) {
            newParticipantMap[participant.id] = existingParticipant;
            return;
          }

          // add the new participant into the participant map
          const { avatar } = participant;
          const sheet = PIXI.Loader.shared.resources[avatar.texture].spritesheet;
          if (sheet) {
            const ctrl = new AvatarControl(participant.displayName, sheet, avatar.script);
            newParticipantMap[participant.id] = {
              id: participant.id,
              displayName: participant.displayName,
              avatar: ctrl,
            };
          }
        });
        store.dispatch(updateParticipantMap(newParticipantMap));
      });
    },
  },
  [getParticipantMap],
);

export const [setAvatarPosition] = createAsyncAction(
  {
    id: 'set-avatar-position',
    async: (store, status) => async (position: EntityPosition) => {
      const { id, x, y } = position;
      const state = store.getState() as IState;
      const participant = state.world.room.participantMap[id];
      if (!participant || !participant.avatar) return;
      const ctrl = participant.avatar;
      const avatar = ctrl.getSprite();

      // receive the x and y velocity to move this avatar
      const xDistance = Math.abs(x - avatar.x);
      const yDistance = Math.abs(y - avatar.y);
      const invVelocity = 56;
      const velocityX = xDistance / (x > avatar.x ? invVelocity : -invVelocity);
      const velocityY = yDistance / (y > avatar.y ? invVelocity : -invVelocity);
      ctrl.moveTo(x, y, velocityX, velocityY);
    },
  },
  [],
);
