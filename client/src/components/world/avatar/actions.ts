import { createAsyncAction } from 'async-selector-kit';
import * as PIXI from 'pixi.js-legacy';
import { IState } from '../../../store';
import { ContentURI } from '../../../shared/constants';
import { getUser } from '../../../shared/user/selectors';
import { AvatarControl } from '../../../shared/sdk/world';
import { getWorldSocket, getParticipantMap, getPixiStage } from '../selectors';
import { ParticipantMap, ParticipantPayload, ReceiveEntityPosition, SendEntityPosition } from '../types';
import { actions } from '../reducer';

const { setParticipantMap: updateParticipantMap } = actions;

export const [handleAvatarPosition] = createAsyncAction(
  {
    id: 'handle-avatar-position',
    async: (store, status, stage, socket) => async (ctrl: AvatarControl) => {
      if (!socket) return;

      /**
       * Updates the position of the avatar.
       */
      const updatePosition = (x: number, y: number) => {
        const avatarPosition: SendEntityPosition = {
          type: 'avatar.position',
          payload: {
            id: ctrl.getEntityId(),
            position: { x, y },
          },
        };
        socket.send(JSON.stringify(avatarPosition));
      };

      // set the initial position of this user's avatar
      const x = stage.width / 2;
      const y = stage.height / 2;
      ctrl.setPosition(x, y);
      updatePosition(x, y);

      // move the avatar whenever the container is clicked
      stage.on('mousedown', (event: PIXI.InteractionEvent) => {
        const { x, y } = event.data.global;
        updatePosition(x, y);
      });
    },
  },
  [getPixiStage, getWorldSocket],
);

export const [setParticipantMap] = createAsyncAction(
  {
    id: 'set-participant-map',
    // eslint-disable-next-line max-len
    async: (store, status, participantMap, stage, user) => async (participants: ParticipantPayload[]) => {
      participants.forEach(({ avatar }) => {
        // setup this avatar's files and load its texture
        avatar.texture = ContentURI + avatar.texture;
        avatar.script = ContentURI + avatar.script;
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
          const texture = PIXI.Loader.shared.resources[avatar.texture];
          const sheet = texture && texture.spritesheet;
          if (sheet) {
            const ctrl = new AvatarControl(avatar.id, profile.displayName, sheet, avatar.script);
            newParticipantMap[participant.id] = {
              ...participant,
              avatar: ctrl,
            };

            const sprite = ctrl.getSprite();
            const name = ctrl.getName();

            // add the avatar and the name onto the stage
            sprite.width = 142;
            sprite.height = 156;
            sprite.anchor.set(0.5, 1);
            name.anchor.set(0.5);
            stage.addChild(sprite);
            stage.addChild(name);

            // move the avatar to the loaded position
            ctrl.setPosition(avatar.position.x, avatar.position.y);

            // if this avatar is handled by this user, then listen for position changes
            const isUserParticipant = participant.profile.id === user.id;
            if (isUserParticipant) {
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
  [getParticipantMap, getPixiStage, getUser],
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
      const time = 56;
      const velocityX = xDistance / (x > avatar.x ? time : -time);
      const velocityY = yDistance / (y > avatar.y ? time : -time);
      ctrl.moveTo(x, y, velocityX, velocityY);
    },
  },
  [],
);
