const hostName = window.location.hostname;

/**
 * The URI for the REST API.
 */
export const RestURI = `http://${hostName}:8000`;

/**
 * The URI for the web-socket connections.
 */
export const SocketURI = `ws://${hostName}:8000`;

/**
 * The application name, can be changed and will render a different
 * name for every component that uses it.
 */
export const AppName = 'HTML5 Whirled';

/**
 * Keys used for local storage.
 */
export enum LocalStorage {
  Session = 'Session',
}
