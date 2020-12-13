import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import * as PIXI from 'pixi.js-legacy';
import { AvatarControl } from '../../shared/sdk/world';
import { EntityPosition, ParticipantPayload, Room, World, WorldError } from './types';

export const initialState: World = {
  error: null,
  pixi: {
    app: new PIXI.Application(),
  },
  room: {
    id: 0,
    participantMap: new Map(),
  },
  socket: null,
};

const slice = createSlice({
  name: 'world',
  initialState,
  reducers: {
    resizePixiApp: (state) => {
      const { app } = state.pixi;
      const parent = app.view.parentElement;
      if (parent) {
        app.renderer.resize(parent.clientWidth, parent.clientHeight);
      }
    },
    setAvatarPosition: (state, action: PayloadAction<EntityPosition>) => {
      const { id, x, y } = action.payload;
      const participant = state.room.participantMap.get(id);
      if (!participant || !participant.avatar) return;
      const ctrl = participant.avatar;
      const stage = state.pixi.app.stage.getChildAt(0);
      const avatar = ctrl.getSprite();

      // receive the x and y velocity to move this avatar
      const xDistance = Math.abs(x - avatar.x);
      const yDistance = Math.abs(y - avatar.y);
      const invVelocity = 56;
      const xVelocity = xDistance / (x > avatar.x ? invVelocity : -invVelocity);
      const yVelocity = yDistance / (y > avatar.y ? invVelocity : -invVelocity);

      let request = 0;
      const moveAvatar = () => {
        if ((xVelocity < 0 && avatar.x <= x) || (xVelocity >= 0 && avatar.x >= x)) {
          ctrl.setPosition(x, y);
          ctrl.setMoving(false);
          return;
        }
        request = requestAnimationFrame(moveAvatar);
        ctrl.setPosition(avatar.x + xVelocity, avatar.y + yVelocity);
        state.pixi.app.renderer.render(stage);
      };

      ctrl.setMoving(true);
      if (request) {
        // cancel the previous movement for this avatar
        cancelAnimationFrame(request);
      }
      moveAvatar();
    },
    setParticipantMap: (state, action: PayloadAction<ParticipantPayload[]>) => {
      action.payload.forEach(({ avatar }) => {
        if (avatar && !PIXI.Loader.shared.resources[avatar.texture]) {
          PIXI.Loader.shared.add(avatar.texture);
        }
      });

      PIXI.Loader.shared.load(() => {
        action.payload.forEach((participant) => {
          if (!state.room.participantMap.has(participant.id)) {
            // add the new participant if the participant isn't already in the map
            const { avatar } = participant;
            const sheet = PIXI.Loader.shared.resources[avatar.texture].spritesheet;
            if (sheet) {
              const ctrl = new AvatarControl(participant.displayName, sheet, avatar.script);
              state.room.participantMap.set(participant.id, {
                id: participant.id,
                displayName: participant.displayName,
                avatar: ctrl,
              });
            }
          }
        });
      });
    },
    setRoom: (state, action: PayloadAction<Room>) => {
      state.room = action.payload;
    },
    setWorldError: (state, action: PayloadAction<WorldError>) => {
      state.error = action.payload;
    },
    setWorldSocket: (state, action: PayloadAction<WebSocket | null>) => {
      state.socket = action.payload;
    },
  },
});

export const { actions } = slice;
export const { reducer } = slice;
