import React, { useContext, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { ThemeContext } from 'styled-components';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import routes, { RoomsRoutesProps } from '../../shared/routes';
import { LocalStorage } from '../../shared/constants';
import { FlexCenter, FlexRow } from '../../shared/styles/flex';
import { getUser } from '../../shared/user/selectors';
import { resizePixiApp, appDOMId } from '../../shared/pixi';
import { Chat } from '../chat';
import { actions as chatActions } from '../chat/reducer';
import { ChatMessage, isReceiveChatMessage } from '../chat/types';
import { actions } from './reducer';
import { getGameError, getRoomId, getRoomSocket } from './selectors';
import { disconnectFromRoom, connectToRoom } from './actions';
import { isConnectionError, isReceiveParticipants } from './types';

const { addMessage } = chatActions;
const { setGameError, setParticipants } = actions;

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

const ErrorContainer = styled(FlexCenter)`
  width: 100%;
`;

const Error = styled.div`
  color: ${(props) => props.theme.errorColors.secondary};
  font-weight: bold;
`;

export const Game = React.memo(() => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const error = useSelector(getGameError);
  const { redirectRoomId, session } = useSelector(getUser);
  const currentRoomId = useSelector(getRoomId);
  const socket = useSelector(getRoomSocket);
  const theme = useContext(ThemeContext);

  // receive the room id that the user is connecting to
  const { id: paramRoomId } = useParams<RoomsRoutesProps>();
  const roomId = paramRoomId ? Number(paramRoomId) : redirectRoomId;

  /**
   * When the user moves between rooms, establish a new connection with the room.
   * This only changes the room connection if the user is moving between rooms.
   */
  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current && currentRoomId !== roomId) {
      const isRoomPath = Boolean(paramRoomId);
      const isIndexPath = location.pathname === routes.index.path;
      if (isRoomPath || isIndexPath) {
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
        dispatch(setGameError(data.payload));
      }
    };

    socket.onclose = () => {
      const errorMessage: ChatMessage = {
        sender: 'Server',
        message: 'There was an issue connecting to the room. The server will redirect you elsewhere.',
        backgroundColor: theme.warningColors.primary,
      };
      dispatch(addMessage(errorMessage));
      history.push(routes.index.path);
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
      <ChatContainer>
        <Chat />
      </ChatContainer>
      <PixiAppContainer id={appDOMId} />
    </Container>
  );
});
