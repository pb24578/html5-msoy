import * as PIXI from 'pixi.js-legacy';
import { AbstractControl } from '.';
import { CrossOriginWorker } from '../net';

export class EntityControl extends AbstractControl {
  protected entity: PIXI.AnimatedSprite;
  protected spritesheet: PIXI.Spritesheet;
  protected worker: any;

  constructor(spritesheet: PIXI.Spritesheet, script: string) {
    super();
    this.spritesheet = spritesheet;
    this.entity = new PIXI.AnimatedSprite([]);
    this.loadEntityScript(script);
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
  public async loadEntityScript(script: string) {
    if (this.worker) {
      this.worker.terminate();
    }
    this.worker = CrossOriginWorker();
    await this.worker.loadCrossOriginScript(script);
  }
}
