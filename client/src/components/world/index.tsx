import React, { createRef, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { replace } from 'connected-react-router';
import styled, { ThemeContext } from 'styled-components';
import { useLocation } from 'react-router-dom';
import * as PIXI from 'pixi.js-legacy';
import { PixiBackground } from '../../assets';
import routes, { getWorldsMatch, WorldsMatch } from '../../shared/routes';
import { FlexCenter, FlexColumn, FlexRow } from '../../shared/styles/flex';
import { getUser, isSessionLoaded } from '../../shared/user/selectors';
import { Chat } from '../chat';
import { actions as chatActions } from '../chat/reducer';
import { ChatMessage, isReceiveChatMessage } from '../chat/types';
import { Toolbar } from '../toolbar';
import { actions } from './reducer';
import {
  getParticipantMap,
  getPixiApp,
  getPixiBackground,
  getPixiStage,
  getRoomId,
  getWorldError,
  getWorldSocket,
} from './selectors';
import { connectToRoom, disconnectFromRoom } from './actions';
import { setAvatarPosition, setParticipantMap } from './avatar/actions';
import { isConnectionError, isReceiveAvatarPosition, isReceiveParticipants, ServerParticipant } from './types';

const { addMessage } = chatActions;
const { resizePixiApp, setWorldError } = actions;

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
  height: 87.5vh;
`;

const Error = styled.div`
  color: ${(props) => props.theme.errorColors.secondary};
  font-weight: bold;
`;

export const World = React.memo(() => {
  const dispatch = useDispatch();
  const location = useLocation();
  const error = useSelector(getWorldError);
  const sessionLoaded = useSelector(isSessionLoaded);
  const { redirectRoomId } = useSelector(getUser);
  const currentRoomId = useSelector(getRoomId);
  const socket = useSelector(getWorldSocket);
  const theme = useContext(ThemeContext);

  // receive the room id that the user is connecting to
  const worldsMatch: WorldsMatch = useSelector(getWorldsMatch);
  const paramRoomId = worldsMatch?.params.id;
  const roomId = paramRoomId ? Number(paramRoomId) : redirectRoomId;

  // receive pixi-related objects
  const app = useSelector(getPixiApp);
  const stage = useSelector(getPixiStage);
  const background = useSelector(getPixiBackground);

  // handle the participants in the world
  const [pixiRequestFrame, setPixiRequestFrame] = useState(0);
  const participantMap = useSelector(getParticipantMap);

  /**
   * Creates a reference to the Pixi App container. Once the reference
   * has been created, then set the Pixi app's view to the container,
   * reset the Pixi app, and add this room's content onto the app.
   */
  const pixiRef = createRef<HTMLDivElement>();
  useEffect(() => {
    if (!pixiRef.current || !socket) return;
    pixiRef.current.append(app.view);
    app.stage.removeChildren();
    dispatch(resizePixiApp());

    // reset the app's stage
    stage.off('mousedown');
    stage.removeChildren();
    stage.interactive = true;
    app.stage.addChild(stage);

    // add the container's background
    background.texture = PIXI.Texture.from(PixiBackground);
    background.width = app.screen.width;
    background.height = app.screen.height;
    stage.addChild(background);
  }, [pixiRef.current, socket]);

  /**
   * Called whenever a re-render occurs for entities in the world.
   */
  useEffect(() => {
    const participants = Object.values(participantMap);

    /**
     * The Pixi loop the re-renders entities to animate movement.
     */
    const pixiLoop = () => {
      Object.values(participants).forEach((participant) => {
        const ctrl = participant.avatar;
        if (ctrl) {
          ctrl.moveActor();
        }
      });
      setPixiRequestFrame(requestAnimationFrame(pixiLoop));
      app.renderer.render(stage);
    };
    if (pixiRequestFrame) {
      cancelAnimationFrame(pixiRequestFrame);
    }
    pixiLoop();
  }, [participantMap]);

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
    if (sessionLoaded) {
      connectToRoom(roomId);
    }
  }, [sessionLoaded]);

  /**
   * Listen to messages when the socket is established.
   */
  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (isReceiveParticipants(data)) {
        setParticipantMap(data.payload.participants);
      }

      if (isReceiveAvatarPosition(data)) {
        setAvatarPosition(data);
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
        sender: ServerParticipant,
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
    dispatch(resizePixiApp());
  }, [location]);

  /**
   * Resize the Pixi App container and background whenever the window size changes.
   */
  window.onresize = () => {
    dispatch(resizePixiApp());
  };

  if (error) {
    return (
      <ErrorContainer>
        <Error>{error.reason}</Error>
      </ErrorContainer>
    );
  }

  return (
    <Container>
      <GameContainer>
        <ChatContainer>
          <Chat />
        </ChatContainer>
        <PixiAppContainer ref={pixiRef} />
      </GameContainer>
      <ToolbarContainer>
        <Toolbar />
      </ToolbarContainer>
    </Container>
  );
});
