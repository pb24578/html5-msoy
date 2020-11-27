import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { FlexRow } from '../../shared/styles/flex';
import { resizePixiApp, appDOMId } from '../../shared/pixi';
import { Chat } from '../chat';
import { connectToRoom } from './actions';

const Container = styled(FlexRow)`
  padding: 8px;
`;

const ChatContainer = styled.div`
  flex: 0.25;
  width: 25%;
`;

const PixiAppContainer = styled.div`
  flex: 0.75;
  width: 75%;
`;

export const Game = React.memo(() => {
  const location = useLocation();

  /**
   * When the component mounts, establish the connection with the room.
   */
  useEffect(() => {
    connectToRoom(1);
  }, []);

  /**
   * If the route location changes, then resize the game client.
   */
  useEffect(() => {
    resizePixiApp();
  }, [location]);

  return (
    <Container>
      <ChatContainer>
        <Chat />
      </ChatContainer>
      <PixiAppContainer>
        <div id={appDOMId} />
      </PixiAppContainer>
    </Container>
  );
});
