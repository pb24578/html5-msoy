import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Chat, ChatMessage } from './types';

export const initialState: Chat = {
  messages: [],
};

const slice = createSlice({
  name: 'Chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
  },
});

export const { actions } = slice;
export const { reducer } = slice;
