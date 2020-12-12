import { ControlEventListener } from '.';

export abstract class AbstractControl {
  protected eventListeners: ControlEventListener[] = [];

  /**
   * Adds an event into a target.
   *
   * @param eventListener The event listener to add.
   */
  protected addEventListener(listener: ControlEventListener) {
    const { target, type } = listener.event;
    target.addEventListener(type, listener.callback);
    this.eventListeners.push(listener);
  }

  /**
   * Removes an event from a target. If two or more events with the same target, type, and name
   * exist, then it'll remove the most recent event listener that was added.
   *
   * @param target The event target to remove a listener from.
   * @param type The event type.
   * @param name The event name.
   */
  protected removeEventListener(target: EventTarget, type: string, name: string) {
    let listenerIndex = -1;
    for (let eInd = this.eventListeners.length - 1; eInd >= 0 && listenerIndex === -1; eInd -= 1) {
      const eventListener = this.eventListeners[eInd];
      const { target: eventTarget, type: eventType, name: eventName } = eventListener.event;
      if (eventTarget === target && eventType === type && eventName === name) {
        listenerIndex = eInd;
      }
    }

    if (listenerIndex !== -1) {
      // remove this event
      const eventListener = this.eventListeners[listenerIndex];
      target.removeEventListener(type, eventListener.callback);
      this.eventListeners.splice(listenerIndex, 1);
    }
  }
}
