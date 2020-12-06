import React, { useContext, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { replace } from 'connected-react-router';
import styled, { ThemeContext } from 'styled-components';
import { useLocation } from 'react-router-dom';
import routes, { getWorldsMatch, WorldsMatch } from '../../shared/routes';
import { LocalStorage } from '../../shared/constants';
import { FlexCenter, FlexColumn, FlexRow } from '../../shared/styles/flex';
import { getUser } from '../../shared/user/selectors';
import { resizePixiApp, appDOMId } from '../../shared/pixi';
import { Chat } from '../chat';
import { actions as chatActions } from '../chat/reducer';
import { ChatMessage, isReceiveChatMessage } from '../chat/types';
import { Toolbar } from '../toolbar';
import { actions } from './reducer';
import { getWorldError, getRoomId, getRoomSocket } from './selectors';
import { disconnectFromRoom, connectToRoom } from './actions';
import { isConnectionError, isReceiveParticipants } from './types';

const { addMessage } = chatActions;
const { setWorldError, setParticipants } = actions;

const Container = styled(FlexColumn)`
  padding-right: 8px;
`;

const ToolbarContainer = styled(FlexRow)`
  align-items: flex-end;
  height: 7.5vh;
`;

const GameContainer = styled(FlexRow)`
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

const ErrorContainer = styled(FlexCenter)`
  width: 100%;
`;

const Error = styled.div`
  color: ${(props) => props.theme.errorColors.secondary};
  font-weight: bold;
`;

export const World = React.memo(() => {
  const dispatch = useDispatch();
  const location = useLocation();
  const error = useSelector(getWorldError);
  const { redirectRoomId, session } = useSelector(getUser);
  const currentRoomId = useSelector(getRoomId);
  const socket = useSelector(getRoomSocket);
  const theme = useContext(ThemeContext);

  // receive the room id that the user is connecting to
  const worldsMatch: WorldsMatch = useSelector(getWorldsMatch);
  const paramRoomId = worldsMatch?.params.id;
  const roomId = paramRoomId ? Number(paramRoomId) : redirectRoomId;

  /**
   * When the user moves between rooms, establish a new connection with the room.
   * This only changes the room connection if the user is moving between rooms.
   */
  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current && currentRoomId !== roomId) {
      const isWorldPath = Boolean(paramRoomId);
      const isIndexPath = location.pathname === routes.index.pathname;
      if (isWorldPath || isIndexPath) {
        connectToRoom(roomId);
      }
    }
    didMount.current = true;
  }, [location]);

  /**
   * When the user logs in, establish a new connection with the room.
   */
  useEffect(() => {
    if (localStorage.getItem(LocalStorage.Session)) {
      // wait until the user is authenticated to connect to the room in the URL
      if (session.token) {
        connectToRoom(roomId);
      }
    } else {
      connectToRoom(roomId);
    }
  }, [session]);

  /**
   * Listen to messages when the socket is established.
   */
  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (isReceiveParticipants(data)) {
        dispatch(setParticipants(data.payload.participants));
      }

      if (isReceiveChatMessage(data)) {
        dispatch(addMessage(data.payload));
      }

      if (isConnectionError(data)) {
        disconnectFromRoom();
        dispatch(setWorldError(data.payload));
      }
    };

    socket.onclose = () => {
      const errorMessage: ChatMessage = {
        sender: {
          id: 0,
          displayName: 'Server',
        },
        message: 'There was an issue connecting to the room. The server will redirect you elsewhere.',
        backgroundColor: theme.warningColors.primary,
      };
      dispatch(addMessage(errorMessage));
      dispatch(replace(routes.index.pathname));
    };
  }, [socket]);

  /**
   * Resize the Pixi App container whenever the route location changes.
   */
  useEffect(() => {
    resizePixiApp();
  }, [location]);

  /**
   * Resize the Pixi App container whenever the window size changes.
   */
  window.onresize = () => {
    resizePixiApp();
  };

  if (error) {
    return (
      <Container>
        <ErrorContainer>
          <Error>{error.reason}</Error>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <GameContainer>
        <ChatContainer>
          <Chat />
        </ChatContainer>
        <PixiAppContainer id={appDOMId} />
      </GameContainer>
      <ToolbarContainer>
        <Toolbar />
      </ToolbarContainer>
    </Container>
  );
});
