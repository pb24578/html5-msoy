import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import * as PIXI from 'pixi.js-legacy';
import { Participant, ParticipantMap, Room, World, WorldError } from './types';

export const initialState: World = {
  error: null,
  pixi: {
    app: new PIXI.Application(),
    stage: new PIXI.Container(),
    background: new PIXI.Sprite(),
  },
  room: {
    id: 0,
    participant: null,
    participantMap: {},
  },
  socket: null,
};

const slice = createSlice({
  name: 'world',
  initialState,
  reducers: {
    resizePixiApp: (state) => {
      const { app, background } = state.pixi;
      const parent = app.view.parentElement;
      if (parent) {
        app.renderer.resize(parent.clientWidth, parent.clientHeight);
      }

      if (background.width < app.screen.width) {
        // resize the background width if it's too small to fit the app's screen
        background.width = app.screen.width;
      }

      if (background.height < app.screen.height) {
        // resize the background height if it's too small to fit the app's screen
        background.width = app.screen.width;
      }
    },
    setParticipant: (state, action: PayloadAction<Participant>) => {
      state.room.participant = action.payload;
    },
    setParticipantMap: (state, action: PayloadAction<ParticipantMap>) => {
      state.room.participantMap = action.payload;
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
