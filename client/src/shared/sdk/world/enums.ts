export enum EntityType {
  ENTITY = 'entity',
  AVATAR = 'avatar',
}

export enum WorkerMessage {
  /**
   * Called to the worker once the spritesheet data has loaded.
   */
  SPRITESHEET = 'spritesheet',

  /**
   * Called to the worker whenever the actor is moving.
   */
  MOVING = 'moving',

  /**
   * Called whenever the worker registers states to the actor.
   */
  REGISTER_STATES = 'registerStates',

  /**
   * Called whenever the worker registers actions to the avatar.
   */
  REGISTER_ACTIONS = 'registerActions',

  /**
   * Called whenever the worker sets a state to the actor.
   */
  SET_STATE = 'setState',
}
