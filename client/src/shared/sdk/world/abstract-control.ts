export abstract class AbstractControl {
  protected socket: WebSocket;

  constructor(socket: WebSocket) {
    this.socket = socket;
  }
}
