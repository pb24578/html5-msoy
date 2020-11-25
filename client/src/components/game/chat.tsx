import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { socket } from '../../sockets/room';
import theme, { qAlphaTheme } from '../../shared/styles/theme';
import { FlexColumn } from '../../shared/styles/flex';
import { isChatMessage, isUsersList } from '../../shared/types/room';

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
  margin-bottom: 8px;
  padding: 4px;
  max-width: 200px;
  overflow-y: auto;
  overflow-x: auto;
  background-color: ${qAlphaTheme.primary};
`;

const User = styled.div`
  margin: 2px;
`;

/**
 * A container for the chat history's overflow-y.
 */
const ChatHistoryContainer = styled(FlexColumn)`
  flex: 0.8;
  height: 0;
`;

const ChatHistory = styled(FlexColumn)`
  flex-direction: column-reverse;
  align-items: flex-start;
  height: 100%;
  overflow-y: auto;
`;

interface MessageProps {
  readonly backgroundColor: string;
}

const Message = styled.div<MessageProps>`
  position: relative;
  margin-bottom: 36px;
  padding: 8px;
  width: 80%;
  word-wrap: break-word;
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

export const Chat = React.memo(() => {
  const [usersList, setUsersList] = useState([] as React.ReactElement[]);
  const [chats, setChats] = useState([] as React.ReactElement[]);

  /**
   * Listen to chat messages from other users when this component mounts.
   */
  useEffect(() => {
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (isChatMessage(data)) {
        chats.unshift(
          <Message key={chats.length} backgroundColor="#5FC7FF">
            {data.message}
            <MessageSender>Anonymous</MessageSender>
          </Message>,
        );
        setChats([...chats]);
      } else if (isUsersList(data)) {
        const usersList = data.users.map((user) => <User key={user}>{user}</User>);
        setUsersList(usersList);
      }
    };
  }, []);

  return (
    <Container>
      <UsersTitle>Users Online</UsersTitle>
      <UsersList>{usersList}</UsersList>
      <ChatHistoryContainer>
        <ChatHistory>{chats}</ChatHistory>
      </ChatHistoryContainer>
    </Container>
  );
});
