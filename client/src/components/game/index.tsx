import React from 'react';
import styled from 'styled-components';
import { FlexRow } from '../../shared/styles/flex';
import app, { appDOMId } from '../../shared/pixi';
import { Chat } from './chat';

const Container = styled(FlexRow)`
  padding: 8px;
`;

const ChatContainer = styled.div`
  flex: 0.25;
`;

const GameClient = styled.div`
  flex: 0.75;
`;

export const Game = React.memo(() => (
  <Container>
    <ChatContainer>
      <Chat />
    </ChatContainer>
    <GameClient id={appDOMId} />
  </Container>
));
