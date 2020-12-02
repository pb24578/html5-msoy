import React, { createRef, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled, { ThemeContext } from 'styled-components';
import { FlexColumn } from '../../shared/styles/flex';
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

  return (
    <Container>
      <UsersTitle>Users Online</UsersTitle>
      <UsersList>
        {participants.map((participant, index) => (
          <Participant key={index}>{participant.displayName}</Participant>
        ))}
      </UsersList>
      <ChatHistoryOverflow>
        <ChatHistory ref={chatRef}>
          {messages.reduceRight((elements, message, index) => {
            const backgroundColor = message.backgroundColor || theme.darkerColors.primary;
            elements.push(
              <Message key={index} backgroundColor={backgroundColor}>
                {message.message}
                <MessageSender>{message.sender.displayName}</MessageSender>
              </Message>,
            );
            return elements;
          }, [] as React.ReactElement[])}
        </ChatHistory>
      </ChatHistoryOverflow>
    </Container>
  );
});
