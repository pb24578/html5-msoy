import { AbstractControl } from '.';
import { CrossOriginWorker } from '../net';

export class EntityControl extends AbstractControl {
  protected worker: any;

  /**
   * Loads the JavaScript logic for this entity. This script is a JavaScript file that
   * contains logic for how the entity interacts with the world environenment. This
   * file is created by the user that created the entity.
   *
   * Any subsequent calls to this function will terminate the previous script.
   *
   * @param script The URL to the entity's script logic.
   */
  public async loadScript(script: string) {
    if (this.worker) {
      this.worker.terminate();
    }
    this.worker = CrossOriginWorker();
    await this.worker.loadCrossOriginScript(script);
  }
}
