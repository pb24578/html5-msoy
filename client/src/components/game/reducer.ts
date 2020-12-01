import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Game, Participant, Room } from './types';

export const initialState: Game = {
  room: {
    id: 1,
    participants: [],
    socket: null,
  },
};

const slice = createSlice({
  name: 'Game',
  initialState,
  reducers: {
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
