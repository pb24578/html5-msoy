import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import * as PIXI from 'pixi.js-legacy';
import { EntityPosition, Participant, Room, World, WorldError } from './types';

export const initialState: World = {
  error: null,
  pixi: {
    app: new PIXI.Application(),
  },
  room: {
    id: 0,
    participants: [],
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
