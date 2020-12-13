export class WorkerMessage {
  /**
   * Called once the spritesheet data has loaded.
   */
  public static spritesheet: string = 'spritesheet';

  /**
   * Called whenever the actor is moving.
   */
  public static moving: string = 'moving';

  /**
   * Called to register states to the actor.
   */
  public static registerStates: string = 'registerStates';

  /**
   * Called to register actions to the avatar.
   */
  public static registerActions: string = 'registerActions';

  /**
   * Called to set a state to the actor.
   */
  public static setState: string = 'setState';
}
