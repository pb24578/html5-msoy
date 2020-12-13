import { ActorControl, WorkerMessage } from '.';

export class AvatarControl extends ActorControl {
  private actions: string[] = [];

  /**
   * @override
   */
  protected listenWorkerMessage() {
    super.listenWorkerMessage();
    this.worker.addEventListener('message', (event: MessageEvent) => {
      const { data } = event;

      if (data.type === WorkerMessage.registerActions) {
        const { value } = data.payload;
        this.registerActions(value);
      }
    });
  }

  /**
   * Registers the avatar's actions.
   *
   * @param actions An Array of actions, each must be less than 64 characters.
   */
  public registerActions(actions: string[]) {
    const maxActionLength = 64;

    const registeredActions = actions.map((action) => {
      if (action.length > maxActionLength) {
        throw new Error(`Actions cannot be greater than ${maxActionLength} characters.`);
      }
      return action;
    });

    this.actions = registeredActions;
  }
}
