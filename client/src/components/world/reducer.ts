import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import * as PIXI from 'pixi.js-legacy';
import { AvatarControl } from '../../shared/sdk/world';
import { Avatar, EntityPosition, Participant, Room, World, WorldError } from './types';

export const initialState: World = {
  error: null,
  pixi: {
    app: new PIXI.Application(),
  },
  room: {
    id: 0,
    participants: [],
    avatarMap: new Map(),
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
    setAvatarMap: (state, action: PayloadAction<Avatar[]>) => {
      action.payload.forEach((avatar) => {
        if (!PIXI.Loader.shared.resources[avatar.texture]) {
          PIXI.Loader.shared.add(avatar.texture);
        }
      });

      PIXI.Loader.shared.load(() => {
        for (let avatarIndex = 0; avatarIndex < action.payload.length; avatarIndex += 1) {
          const avatar = action.payload[avatarIndex];
          if (!state.room.avatarMap.has(avatar.id)) {
            // add the new avatar if it doesn't already exist in the avatar map
            const sheet = PIXI.Loader.shared.resources[avatar.texture].spritesheet;
            if (sheet) {
              const ctrl = new AvatarControl(avatar.owner.displayName, sheet, avatar.script);
              state.room.avatarMap.set(avatar.id, ctrl);
            }
          }
        }
      });
    },
    setAvatarPosition: (state, action: PayloadAction<EntityPosition>) => {
      const { id, x, y } = action.payload;
      const ctrl = state.room.avatarMap.get(id);
      if (!ctrl) return;
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
    setParticipants: (state, action: PayloadAction<Participant[]>) => {
      state.room.participants = action.payload;
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
