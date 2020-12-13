import * as PIXI from 'pixi.js-legacy';
import { AbstractControl, WorkerMessage } from '.';

export class EntityControl extends AbstractControl {
  protected id: number;
  protected sprite: PIXI.AnimatedSprite;
  protected default: string;
  protected sheet: PIXI.Spritesheet;
  protected worker: Worker;

  constructor(id: number, sheet: PIXI.Spritesheet, script: string) {
    super();
    this.id = id;

    // receive the "default" animation, which is the first sheet animation
    const animations = Object.keys(sheet.animations);
    if (animations.length === 0) {
      throw new Error('No animations have been defined in the spritesheet.');
    }

    [this.default] = animations;
    this.sprite = new PIXI.AnimatedSprite(sheet.animations[this.default]);
    this.sheet = sheet;
    this.worker = this.loadEntityWorker(script);

    // send the spritesheet JSON data to the worker
    this.worker.postMessage({
      type: WorkerMessage.spritesheet,
      payload: {
        value: this.sheet.data,
      },
    });
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
  private loadEntityWorker(script: string) {
    if (this.worker) {
      this.worker.terminate();
    }

    /**
     * Loads a worker from an external URL.
     * https://stackoverflow.com/questions/21913673/execute-web-worker-from-different-origin
     */
    const getWorkerScript = (script: string) => {
      const content = `importScripts( "${script}" );`;
      return URL.createObjectURL(new Blob([content], { type: 'text/javascript' }));
    };

    const workerScript = getWorkerScript(script);
    this.worker = new Worker(workerScript);
    this.listenWorkerMessage();
    URL.revokeObjectURL(workerScript);
    return this.worker;
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
  }

  /**
   * Returns the entity's id
   */
  public getEntityId() {
    return this.id;
  }

  /**
   * Returns the entity's animated sprite.
   */
  public getSprite() {
    return this.sprite;
  }

  /**
   * Returns the spritesheet.
   */
  public getSpriteSheet() {
    return this.sheet;
  }
}
