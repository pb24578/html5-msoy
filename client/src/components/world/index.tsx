import React, { createRef, useContext, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { replace } from 'connected-react-router';
import styled, { ThemeContext } from 'styled-components';
import { useLocation } from 'react-router-dom';
import * as PIXI from 'pixi.js-legacy';
import { PixiBackground } from '../../assets';
import routes, { getWorldsMatch, WorldsMatch } from '../../shared/routes';
import { FlexCenter, FlexColumn, FlexRow } from '../../shared/styles/flex';
import { getUser, isSessionLoaded } from '../../shared/user/selectors';
import { AvatarControl } from '../../shared/sdk/world';
import { Chat } from '../chat';
import { actions as chatActions } from '../chat/reducer';
import { ChatMessage, isReceiveChatMessage } from '../chat/types';
import { Toolbar } from '../toolbar';
import { actions } from './reducer';
import { getPixiApp, getRoomId, getWorldError, getWorldSocket } from './selectors';
import { disconnectFromRoom, connectToRoom } from './actions';
import { isConnectionError, isReceiveAvatarPosition, isReceiveParticipants } from './types';

const { addMessage } = chatActions;
const { resizePixiApp, setAvatarPosition, setWorldError, setParticipants } = actions;

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
  const app = useSelector(getPixiApp);
  const sessionLoaded = useSelector(isSessionLoaded);
  const { displayName, redirectRoomId } = useSelector(getUser);
  const currentRoomId = useSelector(getRoomId);
  const socket = useSelector(getWorldSocket);
  const theme = useContext(ThemeContext);

  // receive the room id that the user is connecting to
  const worldsMatch: WorldsMatch = useSelector(getWorldsMatch);
  const paramRoomId = worldsMatch?.params.id;
  const roomId = paramRoomId ? Number(paramRoomId) : redirectRoomId;

  /**
   * Creates a reference to the Pixi App container. Once the reference
   * has been created, then set the Pixi app's view to the container,
   * reset the Pixi app, and add this room's content onto the app.
   */
  const pixiRef = createRef<HTMLDivElement>();
  useEffect(() => {
    if (!pixiRef.current || !sessionLoaded || !socket) return;
    pixiRef.current.append(app.view);
    app.stage.removeChildren();
    dispatch(resizePixiApp());

    // create the app's stage
    const stage = new PIXI.Container();
    stage.interactive = true;
    app.stage.addChild(stage);

    // add the container's background
    const background = PIXI.Sprite.from(PixiBackground);
    background.width = app.screen.width;
    background.height = app.screen.height;
    stage.addChild(background);

    const avatarLoader = new PIXI.Loader();
    const sprite = 'http://localhost:8000/media/soda/texture.png';
    const texture = 'http://localhost:8000/media/soda/texture.json';
    avatarLoader.add(texture);
    avatarLoader.add(sprite);
    avatarLoader.load(() => {
      const sheet = avatarLoader.resources[texture].spritesheet;
      if (sheet) {
        const ctrl = new AvatarControl(sheet, 'http://localhost:8000/media/body.js');
        const avatar = ctrl.getSprite();

        // add an example avatar
        avatar.width = 142;
        avatar.height = 156;
        avatar.anchor.set(0.5);
        stage.addChild(avatar);

        // add the user's name
        const name = new PIXI.Text(displayName, { fill: 0xffffff, fontSize: 16 });
        name.anchor.set(0.5);
        stage.addChild(name);

        const setAvatarPosition = (x: number, y: number) => {
          avatar.x = x;
          avatar.y = y;
          name.x = avatar.x;
          name.y = avatar.y - avatar.height / 2 - 10;
        };

        // set the sprite's position to the middle of the stage
        setAvatarPosition(stage.width / 2, stage.height / 2);

        // move the avatar whenever the container is clicked
        let request = 0;
        stage.on('mousedown', (event: PIXI.InteractionEvent) => {
          const { x, y } = event.data.global;
          const xDistance = Math.abs(x - avatar.x);
          const yDistance = Math.abs(y - avatar.y);
          const invVelocity = 56;
          const xVelocity = xDistance / (x > avatar.x ? invVelocity : -invVelocity);
          const yVelocity = yDistance / (y > avatar.y ? invVelocity : -invVelocity);

          const moveAvatar = () => {
            if ((xVelocity < 0 && avatar.x <= x) || (xVelocity >= 0 && avatar.x >= x)) {
              setAvatarPosition(x, y);
              ctrl.setMoving(false);
              return;
            }
            request = requestAnimationFrame(moveAvatar);
            setAvatarPosition(avatar.x + xVelocity, avatar.y + yVelocity);
            app.renderer.render(stage);
          };

          ctrl.setMoving(true);
          if (request) {
            // cancel the previous movement for this Avatar
            cancelAnimationFrame(request);
          }
          moveAvatar();
        });
      }
    });
  }, [pixiRef.current, sessionLoaded, socket]);

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
        dispatch(setParticipants(data.payload.participants));
      }

      if (isReceiveAvatarPosition(data)) {
        dispatch(setAvatarPosition(data.payload));
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
    dispatch(resizePixiApp());
  }, [location]);

  /**
   * Resize the Pixi App container whenever the window size changes.
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
