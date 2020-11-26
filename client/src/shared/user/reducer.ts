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
  name: 'Session',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.session.token = action.payload;
    },
  },
});

export const { actions } = slice;
export const { reducer } = slice;
