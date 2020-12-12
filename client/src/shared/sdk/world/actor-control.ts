import { EntityControl, ControlEvent, WorkerMessage } from '.';

interface State {
  name: string;
}

export class ActorControl extends EntityControl {
  protected states: State[] = [];
  protected currentState: State | null = null;
  protected moving = false;

  /**
   * Listen to the worker's message events. Call this once the worker has been loaded.
   *
   * @param worker The worker that was just loaded.
   */
  protected listenWorkerMessage() {
    super.listenWorkerMessage();
    this.worker.addEventListener('message', (event: MessageEvent) => {
      const { data } = event;
      console.log('dead ass 2');

      if (data.type === WorkerMessage.isMoving) {
        this.worker.postMessage({
          type: WorkerMessage.isMoving,
          payload: {
            value: this.moving,
          },
        });
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
    const newState = this.states.find((currentState) => currentState.name === state);
    if (!newState) {
      throw new Error(`The state ${state} does not exist.`);
    }
    this.currentState = newState;
  }

  /**
   * Sets if the actor is now moving and dispatches an appearance changed event.
   */
  public setMoving(moving: boolean) {
    this.moving = moving;
    this.worker.dispatchEvent(ControlEvent.appearanceChanged);
  }
}
