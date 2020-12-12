export interface EventListener {
  event: string;
  name: string;
}

export enum ControlEvent {
  APPEARANCE_CHANGED = 'APPEARANCE_CHANGED',
}
