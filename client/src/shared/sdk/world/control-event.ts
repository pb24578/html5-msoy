export interface EventListener {
  event: string;
  name: string;
}

export enum ControlEvent {
  APPEARANCE_CHANGED = 'appearanceChanged',
}
