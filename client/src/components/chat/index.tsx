import React, { createRef, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import styled, { ThemeContext } from 'styled-components';
import routes from '../../shared/routes';
import { FlexColumn } from '../../shared/styles/flex';
import { Participant } from '../game/types';
import { getMessages, getParticipants } from './selectors';

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

const ChatParticipant = styled.div`
  margin: 2px;
  cursor: pointer;
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
  cursor: pointer;
`;

export const Chat = React.memo(() => {
  const dispatch = useDispatch();
  const messages = useSelector(getMessages);
  const participants = useSelector(getParticipants);
  const theme = useContext(ThemeContext);

  /**
   * Scroll to the bottom of the chat if the chat is anchored to the bottom.
   */
  const chatRef = createRef<HTMLDivElement>();
  useEffect(() => {
    if (chatRef && chatRef.current) {
      const ref = chatRef.current;
      const recentMessageRef = ref.children[0];
      const offsetMultiplier = 3;
      if (recentMessageRef && ref.scrollTop >= -recentMessageRef.scrollHeight * offsetMultiplier) {
        ref.scrollTop = 0;
      }
    }
  }, [messages]);

  const openPopover = (participant: Participant) => {
    dispatch(push(`${routes.profiles.pathname}/${participant.id}`));
  };

  return (
    <Container>
      <UsersTitle>Users Online</UsersTitle>
      <UsersList>
        {participants.map((participant, index) => (
          <ChatParticipant key={index} onClick={() => openPopover(participant)}>
            {participant.displayName}
          </ChatParticipant>
        ))}
      </UsersList>
      <ChatHistoryOverflow>
        <ChatHistory ref={chatRef}>
          {messages.reduceRight((elements, message, index) => {
            const backgroundColor = message.backgroundColor || theme.darkerColors.primary;
            const participant = message.sender;
            const { displayName } = message.sender;
            const onClick = () => openPopover(participant);
            elements.push(
              <Message key={index} backgroundColor={backgroundColor}>
                {message.message}
                <MessageSender onClick={onClick}>{displayName}</MessageSender>
              </Message>,
            );
            return elements;
          }, [] as React.ReactElement[])}
        </ChatHistory>
      </ChatHistoryOverflow>
    </Container>
  );
});
