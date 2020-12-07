import { IState } from '../../store';

/**
 * Misc. selectors.
 */
export const getWorldError = (state: IState) => state.world.error;

/**
 * Pixi-related selectors.
 */
export const getPixiApp = (state: IState) => state.world.pixi.app;

/**
 * Room-related selectors.
 */
export const getParticipants = (state: IState) => state.world.room.participants;
export const getRoomId = (state: IState) => state.world.room.id;
export const getRoomSocket = (state: IState) => state.world.room.socket;
