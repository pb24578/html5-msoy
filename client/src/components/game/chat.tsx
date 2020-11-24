import React from 'react';
import styled from 'styled-components';
import { FlexColumn, FlexCenter } from '../../shared/styles/flex';

const Container = styled(FlexColumn)`
  padding: 8px;
  height: 100%;
`;

const UsersTitle = styled.div`
  flex: 0.05;
  margin-bottom: 2px;
  font-size: 16px;
  font-weight: bold;
`;

const UsersList = styled(FlexColumn)`
  flex: 0.2;
  padding: 4px;
  max-width: 200px;
  overflow-y: auto;
  overflow-x: auto;
  background-color: rgba(40, 172, 222, 0.25);
`;

const User = styled.div`
  margin: 2px;
`;

const ChatHistory = styled(FlexColumn)`
  flex: 0.7;
  justify-content: flex-end;
  align-items: flex-start;
`;

interface MessageProps {
  readonly isAlternate: boolean;
}

const Message = styled.div<MessageProps>`
  margin-bottom: 2px;
  padding: 8px;
  width: 80%;
  background-color: ${({ isAlternate }) => (isAlternate ? 'rgba(40, 172, 222, 0.25)' : '#ffffff')};
`;

const ChatBox = styled(FlexCenter)`
  flex: 0.05;
`;

const ChatTextField = styled.input`
  flex: 0.8;
  height: 24px;
  margin-right: 4px;
`;

const SendButton = styled(FlexCenter)`
  flex: 0.2;
  padding: 6px;
  color: #ffffff;
  background-color: #28acde;
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
      <Message isAlternate>Shadowsych: This is a message.</Message>
      <Message isAlternate={false}>Five: This is another message.</Message>
    </ChatHistory>
    <ChatBox>
      <ChatTextField placeholder="Type here to chat" />
      <SendButton>Send</SendButton>
    </ChatBox>
  </Container>
));
