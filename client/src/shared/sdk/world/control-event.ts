import { EventHandler } from 'react';

export class ControlEvent {
  public target: EventTarget;
  public type: string;
  public name: string;

  /**
   * An event that is dispatched when the actor's appearance changes.
   * This is a helpful event for the isMoving and getOrientation functions.
   */
  public static appearanceChanged = new Event('appearanceChanged');

  constructor(target: EventTarget, type: string, name: string) {
    this.target = target;
    this.type = type;
    this.name = name;
  }
}

export interface ControlEventListener {
  event: ControlEvent;
  callback: EventHandler<any>;
}
