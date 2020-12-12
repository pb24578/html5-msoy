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
   * Removes an event from a target.
   *
   * @param target The event target to remove a listener from.
   * @param type The event type.
   * @param name The event name.
   */
  protected removeEventListener(target: EventTarget, type: string, name: string) {
    const listenerIndex = this.eventListeners.findIndex((eventListener) => {
      const { target: eventTarget, type: eventType, name: eventName } = eventListener.event;
      return eventTarget === target && eventType === type && eventName === name;
    });

    if (listenerIndex !== -1) {
      // remove this event
      const eventListener = this.eventListeners[listenerIndex];
      target.removeEventListener(type, eventListener.callback);
      this.eventListeners.splice(listenerIndex, 1);
    }
  }
}
