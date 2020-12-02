import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { User } from './types';

export const initialState: User = {
  id: 0,
  redirectRoomId: 1,
  session: { token: null },
  displayName: '',
  username: '',
  email: '',
};

const slice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.id = action.payload.id;
      state.redirectRoomId = action.payload.redirectRoomId;
      state.session = action.payload.session;
      state.displayName = action.payload.displayName;
      state.username = action.payload.username;
      state.email = action.payload.email;
    },
  },
});

export const { actions } = slice;
export const { reducer } = slice;
