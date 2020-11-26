import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SocketURI } from '../../shared/constants';

export interface Room {
  id: number;
  socket: WebSocket | null;
}

export interface Game {
  room: Room;
}

const initialState: Game = {
  room: { id: 0, socket: null },
};

const slice = createSlice({
  name: 'Game',
  initialState,
  reducers: {
    setRoom: (state, action: PayloadAction<number>) => {
      const roomId = action.payload;
      state.room.id = roomId;
      state.room.socket = new WebSocket(`${SocketURI}/room/${roomId}`);
    },
  },
});

export const { actions } = slice;
export const { reducer } = slice;
