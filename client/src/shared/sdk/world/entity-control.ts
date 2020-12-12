import * as PIXI from 'pixi.js-legacy';
import { AbstractControl, EventListener, WorkerMessage } from '.';
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
    const worker = CrossOriginWorker();
    await worker.loadCrossOriginScript(script);
    this.workerLoaded(worker);
  }

  /**
   * Called whenever the worker has been loaded.
   *
   * @param worker The worker that was just loaded.
   */
  protected workerLoaded(worker: any) {
    this.worker = worker;
    worker.addEventListener('message', (event: MessageEvent) => {
      const { data } = event;
      if (data.type === WorkerMessage.ADD_EVENT_LISTENER) {
        const listener: EventListener = data.payload;
        this.addEventListener(listener);
      } else if (data.type === WorkerMessage.REMOVE_EVENT_LISTENER) {
        const listener: EventListener = data.payload;
        this.removeEventListener(listener);
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

  /**
   * Dispatches an event to the worker. There can be multiple events that were
   * registered with different names, so this function iterates all the events
   * that were registered and dispatches them.
   *
   * @param eventDispatch The event to dispatch
   */
  protected dispatchEvent(event: string) {
    const listeningEvents = this.getListeningEvents(event);
    listeningEvents.forEach((event) => {
      this.worker.postMessage({
        type: 'event',
        payload: {
          event,
          name: event.name,
        },
      });
    });
  }
}
