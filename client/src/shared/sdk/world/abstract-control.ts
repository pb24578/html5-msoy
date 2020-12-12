interface EventListener {
  name: string;
  event: string;
}

export abstract class AbstractControl {
  protected eventListeners: EventListener[] = [];

  /**
   * Registers an event listener to the list of events.
   *
   * @param event The event to register.
   */
  public addEventListener(event: EventListener) {
    this.eventListeners.push(event);
  }

  /**
   * Removes an event listener from the list of events.
   *
   * @param event The event to remove.
   */
  public removeEventListener(event: EventListener) {
    const eventIndex = this.eventListeners.findIndex(
      (currentEvent) => currentEvent.event === event.event && currentEvent.name === event.name,
    );
    if (eventIndex !== -1) {
      this.eventListeners.splice(eventIndex, 1);
    }
  }

  /**
   * Returns the listening event(s) from the given event string.
   *
   * @param event The event to receive from.
   */
  public getListeningEvents(event: string) {
    const registeredEvents = [];
    for (let eventIndex = 0; eventIndex < this.eventListeners.length; eventIndex += 1) {
      if (this.eventListeners[eventIndex].event === event) {
        registeredEvents.push(this.eventListeners[eventIndex]);
      }
    }
    return registeredEvents;
  }
}
