import { createAsyncAction } from 'async-selector-kit';
import * as PIXI from 'pixi.js-legacy';
import { IState } from '../../store';
import { SocketURI } from '../../shared/constants';
import { getSession, getUser } from '../../shared/user/selectors';
import { AvatarControl } from '../../shared/sdk/world';
import { getWorldSocket, getParticipantMap, getPixiStage } from './selectors';
import { ParticipantMap, ParticipantPayload, Room, ReceiveEntityPosition, SendEntityPosition } from './types';
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
    // eslint-disable-next-line max-len
    async: (store, status, participantMap, stage, user, socket) => async (participants: ParticipantPayload[]) => {
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
          const { avatar, profile } = participant;
          const sheet = PIXI.Loader.shared.resources[avatar.texture].spritesheet;
          if (sheet) {
            const ctrl = new AvatarControl(avatar.id, profile.displayName, sheet, avatar.script);
            newParticipantMap[participant.id] = {
              ...participant,
              avatar: ctrl,
            };

            const sprite = ctrl.getSprite();
            const name = ctrl.getName();

            // add the avatar onto the stage
            sprite.width = 142;
            sprite.height = 156;
            sprite.anchor.set(0.5);
            stage.addChild(sprite);

            // add the avatar's name
            name.anchor.set(0.5);
            stage.addChild(name);

            // move the avatar to the loaded position
            ctrl.setPosition(avatar.position.x, avatar.position.y);

            if (participant.profile.id === user.id) {
              // move the avatar whenever the container is clicked
              stage.on('mousedown', (event: PIXI.InteractionEvent) => {
                if (!socket) return;
                const { x, y } = event.data.global;
                const avatarPosition: SendEntityPosition = {
                  type: 'avatar.position',
                  payload: {
                    id: ctrl.getEntityId(),
                    position: { x, y },
                  },
                };
                socket.send(JSON.stringify(avatarPosition));
              });
            }
          }
        });

        /**
         * Remove avatars from the stage that are no longer in the world.
         */
        Object.values(participantMap).forEach((participant) => {
          if (!newParticipantMap[participant.id]) {
            // delete this avatar since it's no longer in the world
            const ctrl = participant.avatar;
            if (ctrl) {
              stage.removeChild(ctrl.getSprite());
              stage.removeChild(ctrl.getName());
            }
          }
        });
        store.dispatch(updateParticipantMap(newParticipantMap));
      });
    },
  },
  [getParticipantMap, getPixiStage, getUser, getWorldSocket],
);

export const [setAvatarPosition] = createAsyncAction(
  {
    id: 'set-avatar-position',
    async: (store, status) => async (position: ReceiveEntityPosition) => {
      const { participantId } = position.payload;
      const { x, y } = position.payload.position;
      const state = store.getState() as IState;
      const participant = state.world.room.participantMap[participantId];
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
