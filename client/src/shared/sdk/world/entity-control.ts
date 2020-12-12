import * as PIXI from 'pixi.js-legacy';
import { AbstractControl, ControlEvent, WorkerMessage } from '.';
import { CrossOriginWorker } from '../net';

export class EntityControl extends AbstractControl {
  protected entity: PIXI.AnimatedSprite;
  protected spritesheet: PIXI.Spritesheet;
  protected worker: any;

  constructor(spritesheet: PIXI.Spritesheet, script: string) {
    super();
    this.spritesheet = spritesheet;
    this.entity = new PIXI.AnimatedSprite([]);
    this.loadEntityWorker(script);
  }

  /**
   * Loads the JavaScript logic for this entity. This script is a JavaScript file that
   * contains logic for how the entity interacts with the world environenment. This
   * file is created by the user that created the entity.
   *
   * Any subsequent calls to this function will terminate the previous script.
   *
   * @param script The URL to the entity's script logic, will be loaded from a WebWorker.
   */
  private async loadEntityWorker(script: string) {
    if (this.worker) {
      this.worker.terminate();
    }
    this.worker = new CrossOriginWorker();
    await this.worker.loadCrossOriginScript(script);
    this.listenWorkerMessage();
  }

  /**
   * Listen to the worker's message events. Call this once the worker has been loaded.
   *
   * @param worker The worker that was just loaded.
   */
  protected listenWorkerMessage() {
    if (!this.worker) {
      throw new Error('The worker has not yet loaded.');
    }

    this.worker.addEventListener('message', (event: MessageEvent) => {
      const { data } = event;

      if (data.type === WorkerMessage.addEventListener) {
        const { type, name } = data.payload;
        this.addEventListener({
          event: new ControlEvent(this.worker, type, name),
          callback: () => {
            this.worker.postMessage({
              type: 'event',
              payload: data.payload,
            });
          },
        });
      }

      if (data.type === WorkerMessage.removeEventListener) {
        const { type, name } = data.payload;
        this.removeEventListener(this.worker, type, name);
      }
    });
  }

  /**
   * Returns the entity's animated sprite.
   */
  public getEntity() {
    return this.entity;
  }

  /**
   * Returns the spritesheet.
   */
  public getSpriteSheet() {
    return this.spritesheet;
  }
}
