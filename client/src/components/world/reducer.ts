import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { World, WorldError, Participant, Room } from './types';

export const initialState: World = {
  error: null,
  room: {
    id: 0,
    participants: [],
    socket: null,
  },
};

const slice = createSlice({
  name: 'world',
  initialState,
  reducers: {
    setWorldError: (state, action: PayloadAction<WorldError>) => {
      state.error = action.payload;
    },
    setParticipants: (state, action: PayloadAction<Participant[]>) => {
      state.room.participants = action.payload;
    },
    setRoom: (state, action: PayloadAction<Room>) => {
      state.room = action.payload;
    },
  },
});

export const { actions } = slice;
export const { reducer } = slice;
