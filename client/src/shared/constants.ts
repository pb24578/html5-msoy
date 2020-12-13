const hostName = window.location.hostname;

/**
 * The URI for the REST API.
 *
 * The URI must NOT end in a slash.
 */
export const RestURI = `http://${hostName}:8000`;

/**
 * The URI for static and media files. The app uses the same URI for static
 * and media files because it doesn't between those two contents and uses
 * the same hosting service for it.
 *
 * The URI must NOT end in a slash.
 */
export const ContentURI = RestURI;

/**
 * The URI for the web-socket connections.
 *
 * The URI must NOT end in a slash.
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
