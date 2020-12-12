export class WorkerMessage {
  /**
   * Called to send the spritesheet JSON data to the entity. This is helpful for
   * the entity to begin registering the animations into states and actions.
   */
  public static getSpritesheet: string = 'getSpritesheet';

  /**
   * Called to register states to the avatar.
   */
  public static registerStates: string = 'registerStates';

  /**
   * Called whenever the actor is moving.
   */
  public static isMoving: string = 'isMoving';
}
