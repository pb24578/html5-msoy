import React, { useContext, useEffect } from 'react';
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
import { getGameError, getRoomSocket } from './selectors';
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
  const { rootRoomId, session } = useSelector(getUser);
  const { token } = session;
  const socket = useSelector(getRoomSocket);
  const theme = useContext(ThemeContext);

  // receive the room id that the user is connecting to
  const { id: paramRoomId } = useParams<RoomsRoutesProps>();
  const useRoomId = paramRoomId ? Number(paramRoomId) : rootRoomId;
  const safeRoomId = rootRoomId || 1;
  const roomId = useRoomId || 1;

  /**
   * When the component mounts or the user logs in, establish the new connection with the room.
   */
  useEffect(() => {
    if (localStorage.getItem(LocalStorage.Session)) {
      // wait until the user is authenticated to connect to the room in the URL
      if (token) {
        connectToRoom(roomId);
      }
    } else {
      connectToRoom(roomId);
    }
  }, [roomId, token]);

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
      history.push(`${routes.rooms.path}/${safeRoomId}`);
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
