import React from 'react';
import styled from 'styled-components';
import theme, { qAlphaTheme } from '../../shared/styles/theme';
import { FlexColumn } from '../../shared/styles/flex';

const Container = styled(FlexColumn)`
  height: 100%;
`;

const UsersTitle = styled.div`
  flex: 0.05;
  margin-bottom: 2px;
  font-size: 16px;
  font-weight: bold;
`;

const UsersList = styled(FlexColumn)`
  flex: 0.15;
  padding: 4px;
  max-width: 200px;
  overflow-y: auto;
  overflow-x: auto;
  background-color: ${qAlphaTheme.primary};
`;

const User = styled.div`
  margin: 2px;
`;

const ChatHistory = styled(FlexColumn)`
  flex: 0.8;
  justify-content: flex-end;
  align-items: flex-start;
`;

interface MessageProps {
  readonly backgroundColor: string;
}

const Message = styled.div<MessageProps>`
  position: relative;
  margin-bottom: 36px;
  padding: 8px;
  width: 80%;
  border-radius: 6px;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const MessageSender = styled.div`
  position: absolute;
  bottom: -16px;
  left: 4px;
  padding: 4px 8px;
  border-radius: 8px;
  background-color: ${theme.secondary};
  font-size: 12px;
`;

export const Chat = React.memo(() => (
  <Container>
    <UsersTitle>Users Online</UsersTitle>
    <UsersList>
      <User>Shadowsych</User>
      <User>{'y0>'}</User>
      <User>Five</User>
      <User>Zahreik</User>
    </UsersList>
    <ChatHistory>
      <Message backgroundColor="#5FC7FF">
        This is a message.
        <MessageSender>Shadowsych</MessageSender>
      </Message>
      <Message backgroundColor="#94FF54">
        This is also a message.
        <MessageSender>Five</MessageSender>
      </Message>
      <Message backgroundColor="#FFA9FF">
        This is another message.
        <MessageSender>Five</MessageSender>
      </Message>
    </ChatHistory>
  </Container>
));
