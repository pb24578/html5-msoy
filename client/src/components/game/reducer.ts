import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Room, Game } from './types';

export const initialState: Game = {
  room: { id: 1, socket: null },
};

const slice = createSlice({
  name: 'Game',
  initialState,
  reducers: {
    setRoom: (state, action: PayloadAction<Room>) => {
      state.room = action.payload;
    },
  },
});

export const { actions } = slice;
export const { reducer } = slice;
