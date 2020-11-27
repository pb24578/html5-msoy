import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { LocalStorage } from '../../shared/constants';
import { FlexRow } from '../../shared/styles/flex';
import { getToken } from '../../shared/user/selectors';
import { resizePixiApp, appDOMId } from '../../shared/pixi';
import { Chat } from '../chat';
import { connectToRoom } from './actions';

const Container = styled(FlexRow)`
  padding: 8px;
  height: 80vh;
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
  const token = useSelector(getToken);

  /**
   * When the component mounts or the user logs in, establish the new connection with the room.
   */
  useEffect(() => {
    if (localStorage.getItem(LocalStorage.Session)) {
      // wait until the user is authenticated to connect to this room
      if (token) {
        connectToRoom(1);
      }
    } else {
      connectToRoom(1);
    }
  }, [token]);

  /**
   * Resize the Pixi App container whenever the window size changes.
   */
  window.onresize = () => {
    resizePixiApp();
  };

  /**
   * Resize the Pixi App container whenever the route location changes.
   */
  useEffect(() => {
    resizePixiApp();
  }, [location]);

  return (
    <Container>
      <ChatContainer>
        <Chat />
      </ChatContainer>
      <PixiAppContainer id={appDOMId} />
    </Container>
  );
});
