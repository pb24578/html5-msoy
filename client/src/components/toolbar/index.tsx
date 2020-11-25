import React, { useState } from 'react';
import styled from 'styled-components';
import { socket } from '../../sockets/room';
import theme from '../../shared/styles/theme';
import { ChatMessage } from '../../shared/types/room';
import { FlexRow, FlexCenter } from '../../shared/styles/flex';

const Container = styled(FlexRow)`
  padding: 8px;
  height: 100%;
  align-items: center;
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
  color: ${theme.secondary};
  background-color: ${theme.primary};
  cursor: pointer;
`;

const Utilities = styled(FlexRow)`
  flex: 0.2;
`;

const Utility = styled.div`
  margin: 0px 4px;
  cursor: pointer;
`;

export const Toolbar = React.memo(() => {
  const [text, setText] = useState('');

  const onChangeText = (event: React.FormEvent<EventTarget>) => {
    const { value } = event.target as HTMLInputElement;
    setText(value);
  };

  const onSendMessage = () => {
    const message: ChatMessage = {
      message: text,
    };
    socket.send(JSON.stringify(message));
    setText('');
  };

  return (
    <Container>
      <ChatBox>
        <ChatTextField onChange={onChangeText} placeholder="Type here to chat" value={text} />
        <SendButton onClick={onSendMessage}>Send</SendButton>
      </ChatBox>
      <Utilities>
        <Utility>Volume</Utility>
        <Utility>Friends</Utility>
        <Utility>Room</Utility>
      </Utilities>
    </Container>
  );
});
