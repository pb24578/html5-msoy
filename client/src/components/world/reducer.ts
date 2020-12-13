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
    setAvatars: (state, action: PayloadAction<Avatar[]>) => {
      action.payload.forEach((avatar) => {
        if (!PIXI.Loader.shared.resources[avatar.texture]) {
          PIXI.Loader.shared.add(avatar.texture);
        }
      });

      PIXI.Loader.shared.load(() => {
        for (let avatarIndex = 0; avatarIndex < action.payload.length; avatarIndex += 1) {
          const avatar = action.payload[avatarIndex];
          const sheet = PIXI.Loader.shared.resources[avatar.texture].spritesheet;

          // add the new avatar if it doesn't already exist in the avatar map
          if (sheet && !state.room.avatarMap.has(avatar.id)) {
            const ctrl = new AvatarControl(sheet, avatar.script);
            state.room.avatarMap.set(avatar.id, ctrl);
          }
        }
      });
    },
    setAvatarPosition: (state, action: PayloadAction<EntityPosition>) => {
      // none
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
