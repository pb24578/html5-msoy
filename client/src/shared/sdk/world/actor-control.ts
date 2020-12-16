import * as PIXI from 'pixi.js-legacy';
import { EntityControl, WorkerMessage } from '.';

export class ActorControl extends EntityControl {
  protected name: PIXI.Text;
  protected states: string[] = [];
  protected currentState: string;
  protected moving;

  /**
   * The position and velocity to animate the actor to.
   */
  private clickedX: number = 0;
  private clickedY: number = 0;
  private velocityX: number = 0;
  private velocityY: number = 0;

  constructor(id: number, name: string, sheet: PIXI.Spritesheet, script: string) {
    super(id, sheet, script);
    this.currentState = this.default;
    this.moving = false;
    this.name = new PIXI.Text(name, { fill: 0xffffff, fontSize: 16 });
  }

  /**
   * @override
   */
  protected listenWorkerMessage() {
    super.listenWorkerMessage();
    this.worker.addEventListener('message', (event: MessageEvent) => {
      const { data } = event;
      if (data.type === WorkerMessage.registerStates) {
        const { value } = data.payload;
        this.registerStates(value);
      } else if (data.type === WorkerMessage.setState) {
        const { value } = data.payload;
        this.setState(value);
      }
    });
  }

  /**
   * Registers the actor's states. The first state will be your "default" state.
   * These states will appear for the user to see and change between them.
   *
   * @param states An Array of states, each must be less than 64 characters.
   */
  public registerStates(states: string[]) {
    const maxStateLength = 64;

    const registeredStates = states.map((state) => {
      if (state.length > maxStateLength) {
        throw new Error(`States cannot be greater than ${maxStateLength} characters.`);
      }
      return state;
    });

    this.states = registeredStates;
  }

  /**
   * Returns the current state.
   */
  public getState() {
    return this.currentState;
  }

  /**
   * Set a state, the state must be in the animations.
   */
  public setState(state: string) {
    if (!this.sheet.animations[state]) return;
    this.currentState = state;
    this.sprite.textures = this.sheet.animations[state];
    this.sprite.play();
  }

  /**
   * Returns the the name of the actor.
   */
  public getName() {
    return this.name;
  }

  /**
   * Sets the actor's coordinates. This function also aligns the name with the sprite.
   */
  public setCoordinates(x: number, y: number) {
    this.sprite.x = x;
    this.sprite.y = y;
    this.name.x = this.sprite.x;
    this.name.y = this.sprite.y - this.sprite.height + 20;
  }

  /**
   * Returns if the actor is moving.
   */
  public isMoving() {
    return this.moving;
  }

  /**
   * Sets whether or not the actor is moving and posts a message to the worker.
   */
  public setMoving(moving: boolean) {
    this.moving = moving;
    this.worker.postMessage({
      type: WorkerMessage.moving,
      payload: {
        value: moving,
      },
    });
  }

  /**
   * Move to coordinates on the stage with the provided velocity.
   */
  public moveTo(x: number, y: number, velocityX: number, velocityY: number) {
    this.clickedX = x;
    this.clickedY = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
  }

  /**
   * Set the orientation of the avatar based on the direction.
   *
   * @param directionX The direction that the actor will face horizontally.
   * A negative value makes the actor face left while a positive value faces right.
   */
  public setOrientation(directionX: number) {
    const isChangeLeft = directionX <= 0 || this.sprite.scale.x >= 0;
    const isChangeRight = directionX >= 0 || this.sprite.scale.x <= 0;
    if (isChangeLeft && isChangeRight) {
      // flip the direction since the avatar is changing direction
      this.sprite.scale.x *= -1;
    }
  }

  /**
   * A function dispatched to animate moving the actor. This is dispatched by
   * the pixi loop in order to animate the actor moving on the stage. In order
   * for the actor to move, you must call the moveTo function.
   *
   * If the velocity is 0, then the position of the actor does not change.
   *
   */
  public moveActor() {
    if (this.velocityX === 0 && this.velocityY === 0) return;
    if (!this.isMoving()) {
      this.setMoving(true);
    }
    if (
      (this.velocityX < 0 && this.sprite.x <= this.clickedX) ||
      (this.velocityX >= 0 && this.sprite.x >= this.clickedX)
    ) {
      // stop moving because the actor has arrived to the clicked position
      this.setCoordinates(this.clickedX, this.clickedY);
      this.setMoving(false);
      this.clickedX = 0;
      this.clickedY = 0;
      this.velocityX = 0;
      this.velocityY = 0;
      return;
    }
    this.setCoordinates(this.sprite.x + this.velocityX, this.sprite.y + this.velocityY);
  }
}
