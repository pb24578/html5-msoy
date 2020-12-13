import * as PIXI from 'pixi.js-legacy';
import { EntityControl, WorkerMessage } from '.';

export class ActorControl extends EntityControl {
  protected name: PIXI.Text;
  protected states: string[] = [];
  protected currentState: string;
  protected moving;

  constructor(name: string, sheet: PIXI.Spritesheet, script: string) {
    super(sheet, script);
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
      }

      if (data.type === WorkerMessage.setState) {
        const { value } = data.payload;
        this.setState(value);
      }
    });
  }

  /**
   * Registers the actor's states. The first state will be your "default" state.
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
   * Set a state, the state must be in the registered states.
   */
  public setState(state: string) {
    const newState = this.states.find((currentState) => currentState === state);
    if (!newState || !this.sheet.animations[newState]) return;
    this.currentState = newState;
    this.sprite.textures = this.sheet.animations[state];
  }

  /**
   * Returns the the name of the actor.
   */
  public getName() {
    return this.name;
  }

  /**
   * Sets the actor's position. This is helpful to align the name with the sprite.
   */
  public setPosition(x: number, y: number) {
    this.sprite.x = x;
    this.sprite.y = y;
    this.name.x = this.sprite.x;
    this.name.y = this.sprite.y - this.sprite.height / 2 - 10;
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
}
