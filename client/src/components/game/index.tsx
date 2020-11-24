import React from 'react';
import styled from 'styled-components';
import { FlexRow, FlexColumn } from '../../shared/styles/flex';
import app, { appDOMId } from '../../shared/pixi';
import { Chat } from './chat';
import { Toolbar } from './toolbar';

const Container = styled(FlexColumn)`
  padding: 8px;
  padding-bottom: 16px;
`;

const ChatContainer = styled.div`
  flex: 0.25;
`;

const GameClient = styled.div`
  flex: 0.75;
`;

export const Game = React.memo(() => (
  <Container>
    <FlexRow>
      <ChatContainer>
        <Chat />
      </ChatContainer>
      <GameClient id={appDOMId} />
    </FlexRow>
    <Toolbar />
  </Container>
));
