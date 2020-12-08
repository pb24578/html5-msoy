import { ActorControl } from '.';

interface Action {
  name: string;
}

export class AvatarControl extends ActorControl {
  private actions: Action[] | null = null;

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
      const registerAction: Action = {
        name: action,
      };
      return registerAction;
    });

    this.actions = registeredActions;
  }
}
