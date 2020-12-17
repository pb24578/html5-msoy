import { createAsyncAction } from 'async-selector-kit';
import * as PIXI from 'pixi.js-legacy';
import { IState } from '../../../store';
import { ContentURI } from '../../../shared/constants';
import { getUser } from '../../../shared/user/selectors';
import { AvatarControl } from '../../../shared/sdk/world';
import { getParticipant, getParticipantMap, getPixiStage, getWorldSocket } from '../selectors';
import { ParticipantMap, ParticipantPayload } from '../types';
import { actions } from '../reducer';
import { EntityPosition, ReceiveEntityPosition } from './types';

const { setParticipant, setParticipantMap: updateParticipantMap } = actions;

export const [setParticipantMap] = createAsyncAction(
  {
    id: 'set-participant-map',
    async: (store, status, myParticipant, participantMap, stage, user, socket) => async (
      participants: ParticipantPayload[],
    ) => {
      participants.forEach(({ avatar }) => {
        // setup this avatar's files and load its texture
        avatar.texture = ContentURI + avatar.texture;
        avatar.script = ContentURI + avatar.script;
        if (!PIXI.Loader.shared.resources[avatar.texture]) {
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
          const texture = PIXI.Loader.shared.resources[avatar.texture];
          const sheet = texture && texture.spritesheet;
          if (sheet && socket) {
            // determine whether this participant is the owner of this new avatar
            const isMe = !myParticipant && participant.profile.id === user.id;

            // create the avatar control and set the participant
            const entityId = avatar.id;
            const { displayName } = profile;
            const { script } = avatar;
            const ctrl = new AvatarControl(socket, isMe, entityId, displayName, sheet, script);
            newParticipantMap[participant.id] = {
              ...participant,
              avatar: ctrl,
            };

            const sprite = ctrl.getSprite();
            const name = ctrl.getName();

            // add the avatar and the name onto the stage
            sprite.width = 300;
            sprite.height = 225;
            sprite.anchor.set(0.5, 1);
            name.anchor.set(0.5);
            stage.addChild(sprite);
            stage.addChild(name);

            // move the avatar to the loaded coordinates and orientation
            ctrl.setCoordinates(avatar.position.x, avatar.position.y);
            ctrl.setOrientation(avatar.position.directionX);

            // set this user's participant
            if (isMe) {
              const myNewParticipant = newParticipantMap[participant.id];
              store.dispatch(setParticipant(myNewParticipant));

              // listen for this avatar's position changes
              handleAvatarPosition(ctrl);
            }
          }
        });

        const oldParticipants = Object.values(participantMap);
        oldParticipants.forEach((participant) => {
          const isOldParticipant = !newParticipantMap[participant.id];
          if (isOldParticipant) {
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
  [getParticipant, getParticipantMap, getPixiStage, getUser, getWorldSocket],
);

export const [handleAvatarPosition] = createAsyncAction(
  {
    id: 'handle-avatar-position',
    async: (store, status, stage, socket) => async (ctrl: AvatarControl) => {
      if (!socket) return;

      // set the initial position of this avatar
      const x = stage.width / 2;
      const y = stage.height / 2;
      sendAvatarPosition(ctrl, { x, y, directionX: -1 }, false);

      // move the avatar whenever the container is clicked
      stage.on('mousedown', (event: PIXI.InteractionEvent) => {
        const { x, y } = event.data.global;
        const directionX = x - ctrl.getSprite().x;
        sendAvatarPosition(ctrl, { x, y, directionX }, true);
      });
    },
  },
  [getPixiStage, getWorldSocket],
);

export const [sendAvatarPosition] = createAsyncAction(
  {
    id: 'send-avatar-position',
    // eslint-disable-next-line max-len
    async: (store, status, socket) => async (ctrl: AvatarControl, position: EntityPosition, animate: boolean) => {
      if (!socket) return;
      const avatarPosition = {
        type: 'avatar.position',
        payload: {
          id: ctrl.getEntityId(),
          position,
          animate,
        },
      };
      socket.send(JSON.stringify(avatarPosition));
    },
  },
  [getWorldSocket],
);

export const [setAvatarPosition] = createAsyncAction(
  {
    id: 'set-avatar-position',
    async: (store, status) => async (position: ReceiveEntityPosition) => {
      const { animate, participantId } = position.payload;
      const { x, y, directionX } = position.payload.position;
      const state = store.getState() as IState;
      const participant = state.world.room.participantMap[participantId];
      if (!participant || !participant.avatar) return;
      const ctrl = participant.avatar;
      const sprite = ctrl.getSprite();

      /**
       * Move the avatar using a normalized x and y velocity.
       * https://stackoverflow.com/questions/52897297/move-a-ball-an-ellipse-at-a-certain-speed-to-where-the-mouse-was-clicked-pr
       */
      const xDistance = x - sprite.x;
      const yDistance = y - sprite.y;
      const distance = Math.sqrt(xDistance ** 2 + yDistance ** 2);
      if (distance !== 0) {
        if (animate) {
          const speed = 5;
          const velocityX = speed * (xDistance / distance);
          const velocityY = speed * (yDistance / distance);
          ctrl.moveTo(x, y, velocityX, velocityY);
        } else {
          ctrl.setCoordinates(x, y);
        }
        ctrl.setOrientation(directionX);
      }
    },
  },
  [],
);
