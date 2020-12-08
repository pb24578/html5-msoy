import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { VolumeUp, People, MeetingRoom } from '@styled-icons/material';
import { FlexRow, FlexCenter } from '../../shared/styles/flex';
import { getWorldSocket } from '../world/selectors';
import { SendChatMessage } from '../chat/types';

const Container = styled(FlexRow)`
  align-items: center;
  width: 100%;
`;

const ChatBox = styled(FlexCenter)`
  flex: 0.2;
`;

const ChatTextField = styled.input`
  flex: 0.8;
  height: 24px;
  margin-right: 4px;
`;

const SendButton = styled(FlexCenter)`
  flex: 0.2;
  padding: 6px;
  color: ${(props) => props.theme.colors.secondary};
  background-color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
`;

const Utilities = styled(FlexRow)`
  flex: 0.2;
`;

const Utility = styled.div`
  margin: 0px 8px;
  width: 24px;
  height: 24px;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
`;

/**
 * The maximum number of characters that a user can send on the chat.
 */
const maxChars = 256;

export const Toolbar = React.memo(() => {
  const socket = useSelector(getWorldSocket);
  const [textMessage, setMessage] = useState('');

  const onChangeText = (event: React.FormEvent<EventTarget>) => {
    const { value } = event.target as HTMLInputElement;
    if (value.length <= maxChars) {
      setMessage(value);
    }
  };

  const onKeyPress = (event: React.KeyboardEvent<EventTarget>) => {
    const { key } = event;
    if (key === 'Enter') {
      onSendMessage();
    }
  };

  const onSendMessage = () => {
    if (!socket) return;
    const message: SendChatMessage = {
      type: 'message',
      payload: {
        message: textMessage,
      },
    };
    socket.send(JSON.stringify(message));
    setMessage('');
  };

  return (
    <Container>
      <ChatBox>
        <ChatTextField
          onChange={onChangeText}
          onKeyPress={onKeyPress}
          placeholder="Type here to chat"
          value={textMessage}
        />
        <SendButton onClick={onSendMessage}>Send</SendButton>
      </ChatBox>
      <Utilities>
        <Utility>
          <VolumeUp />
        </Utility>
        <Utility>
          <People />
        </Utility>
        <Utility>
          <MeetingRoom />
        </Utility>
      </Utilities>
    </Container>
  );
});
