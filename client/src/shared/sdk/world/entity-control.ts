import * as PIXI from 'pixi.js-legacy';
import { AbstractControl } from '.';
import { CrossOriginWorker } from '../net';

interface DispatchEvent {
  event: string;
  value: any;
}

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
   * @param script The URL to the entity's script logic.
   */
  public async loadEntityWorker(script: string) {
    if (this.worker) {
      this.worker.terminate();
    }
    this.worker = CrossOriginWorker();
    await this.worker.loadCrossOriginScript(script);
  }

  /**
   * Dispatches an event to the worker.
   *
   * @param eventDispatch The event to dispatch
   */
  public dispatchEvent(eventDispatch: DispatchEvent) {
    const registeredEvents = this.getListeningEvents(eventDispatch.event);
    registeredEvents.forEach((event) => {
      this.worker.postMessage({
        type: 'event',
        payload: {
          event: eventDispatch.event,
          name: event.name,
          value: eventDispatch.value,
        },
      });
    });
  }
}
