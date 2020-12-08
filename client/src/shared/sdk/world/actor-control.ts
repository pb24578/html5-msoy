import * as PIXI from 'pixi.js-legacy';
import { EntityControl } from '.';
import { ActorWorker } from './workers';

interface State {
  name: string;
}

export class ActorControl extends EntityControl {
  private workerInstance: any;
  private states: State[] | null = null;
  private currentState: State | null = null;

  constructor(textures: PIXI.Texture[] | PIXI.AnimatedSprite.FrameObject[], autoUpdate?: boolean) {
    super(textures, autoUpdate);
    this.workerInstance = ActorWorker();
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
      const registerState: State = {
        name: state,
      };
      return registerState;
    });

    this.states = registeredStates;
    this.currentState = registeredStates[0] || null;
  }

  /**
   * Returns the current state.
   */
  public getState() {
    if (!this.currentState) throw new Error('You must set a state.');
    return this.currentState.name;
  }

  /**
   * Set a state, the state must be in the registered states.
   */
  public setState(state: string) {
    if (!this.states) throw new Error('You must register states first.');
    const newState = this.states.find((currentState) => currentState.name === state);
    if (!newState) {
      throw new Error(`The state ${state} does not exist.`);
    }
    this.currentState = newState;
  }
}
