import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled, { ThemeContext } from 'styled-components';
import { FlexColumn } from '../../shared/styles/flex';
import { disconnectFromRoom } from '../game/actions';
import { getRoomSocket } from '../game/selectors';
import { isChatParticipants, isReceiveChatMessage, isKick } from './types';

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
  background-color: ${(props) => props.theme.alphaColors.primary};
`;

const Participant = styled.div`
  margin: 2px;
`;

/**
 * A container for the chat history's overflow-y.
 */
const ChatHistoryOverflow = styled(FlexColumn)`
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
  overflow-wrap: anywhere;
  border-radius: 6px;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const MessageSender = styled.div`
  position: absolute;
  bottom: -16px;
  left: 4px;
  padding: 4px 8px;
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.secondary};
  font-size: 12px;
`;

export const Chat = React.memo(() => {
  const [participantList, setParticipantList] = useState([] as React.ReactElement[]);
  const [chats, setChats] = useState([] as React.ReactElement[]);
  const socket = useSelector(getRoomSocket);
  const theme = useContext(ThemeContext);

  /**
   * Listen to chat messages from other users when this component mounts.
   */
  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (isChatParticipants(data)) {
        const participantList = data.payload.participants.map((participant) => (
          <Participant key={participant.id}>{participant.displayName}</Participant>
        ));
        setParticipantList(participantList);
      }

      if (isReceiveChatMessage(data)) {
        chats.unshift(
          <Message key={chats.length} backgroundColor={theme.darkerColors.primary}>
            {data.payload.message}
            <MessageSender>{data.payload.sender}</MessageSender>
          </Message>,
        );
        setChats([...chats]);
      }

      if (isKick(data)) {
        chats.unshift(
          <Message key={chats.length} backgroundColor={theme.errorColors.primary}>
            {data.payload.reason}
            <MessageSender>{data.payload.sender}</MessageSender>
          </Message>,
        );
        setChats([...chats]);
        disconnectFromRoom();
      }
    };
  }, [socket]);

  return (
    <Container>
      <UsersTitle>Users Online</UsersTitle>
      <UsersList>{participantList}</UsersList>
      <ChatHistoryOverflow>
        <ChatHistory>{chats}</ChatHistory>
      </ChatHistoryOverflow>
    </Container>
  );
});
