import { IState } from '../../store';

/**
 * Misc. selectors.
 */
export const getWorldError = (state: IState) => state.world.error;
export const getWorldSocket = (state: IState) => state.world.socket;

/**
 * Pixi-related selectors.
 */
export const getPixiApp = (state: IState) => state.world.pixi.app;
export const getPixiStage = (state: IState) => state.world.pixi.stage;
export const getPixiBackground = (state: IState) => state.world.pixi.background;

/**
 * Room-related selectors.
 */
export const getParticipant = (state: IState) => state.world.room.participant;
export const getParticipantMap = (state: IState) => state.world.room.participantMap;
export const getRoomId = (state: IState) => state.world.room.id;
