import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface Session {
  token: string | null;
}

export interface User {
  id: number;
  session: Session;
  displayName: string;
  username: string;
  email: string;
}

const initialState: User = {
  id: 0,
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
      state.session = action.payload.session;
      state.displayName = action.payload.displayName;
      state.username = action.payload.username;
      state.email = action.payload.email;
    },
  },
});

export const { actions } = slice;
export const { reducer } = slice;
