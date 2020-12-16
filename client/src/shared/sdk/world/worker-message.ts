export enum WorkerMessage {
  /**
   * Called to the worker once the spritesheet data has loaded.
   */
  spritesheet = 'spritesheet',

  /**
   * Called to the worker whenever the actor is moving.
   */
  moving = 'moving',

  /**
   * Called whenever the worker registers states to the actor.
   */
  registerStates = 'registerStates',

  /**
   * Called whenever the worker registers actions to the avatar.
   */
  registerActions = 'registerActions',

  /**
   * Called whenever the worker sets a state to the actor.
   */
  setState = 'setState',
}
