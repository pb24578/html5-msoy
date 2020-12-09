import * as PIXI from 'pixi.js-legacy';
import { AbstractControl } from '.';
import { CrossOriginWorker } from '../net';

type Textures = PIXI.Texture[] | PIXI.AnimatedSprite.FrameObject[];

export class EntityControl extends AbstractControl {
  protected worker: any;

  constructor(textures: Textures, script: string, autoUpdate?: boolean) {
    super(textures, autoUpdate);
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
