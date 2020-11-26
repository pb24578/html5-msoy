import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface Session {
  token: string | null;
}

export interface User {
  session: Session;
  displayName: string | null;
}

const initialState: User = {
  session: { token: null },
  displayName: null,
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
