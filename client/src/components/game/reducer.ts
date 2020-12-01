import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Game, GameError, Participant, Room } from './types';

export const initialState: Game = {
  error: null,
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
    setGameError: (state, action: PayloadAction<GameError>) => {
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
