import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useLocation, useParams } from 'react-router-dom';
import { RoomsRoutesProps } from '../../shared/routes';
import { LocalStorage } from '../../shared/constants';
import { FlexRow } from '../../shared/styles/flex';
import { getUser } from '../../shared/user/selectors';
import { resizePixiApp, appDOMId } from '../../shared/pixi';
import { Chat } from '../chat';
import { actions as chatActions } from '../chat/reducer';
import { isReceiveChatMessage } from '../chat/types';
import { actions } from './reducer';
import { getRoomSocket } from './selectors';
import { disconnectFromRoom, connectToRoom } from './actions';
import { ConnectionError, isConnectionError, isReceiveParticipants } from './types';

const { addMessage } = chatActions;
const { setParticipants } = actions;

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
  const dispatch = useDispatch();
  const location = useLocation();
  const { id: paramRoomId } = useParams<RoomsRoutesProps>();
  const { rootRoomId, session } = useSelector(getUser);
  const { token } = session;
  const socket = useSelector(getRoomSocket);
  const useRoomId = paramRoomId ? Number(paramRoomId) : rootRoomId;
  const roomId = useRoomId || 1;
  const [error, setError] = useState<ConnectionError>();

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
        setError(data);
        disconnectFromRoom();
      }
    };
  }, [socket]);

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
