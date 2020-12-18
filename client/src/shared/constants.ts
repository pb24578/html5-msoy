const hostName = window.location.hostname;

/**
 * The URI for the REST API.
 *
 * The URI must NOT end in a slash.
 */
export const REST_URI = `http://${hostName}:8000`;

/**
 * The URI for static and media files. The app uses the same URI for static
 * and media files because it expects to use the same hosting service for content.
 *
 * The URI must NOT end in a slash.
 */
export const CONTENT_URI = `http://${hostName}:8000`;

/**
 * The URI for the web-socket connections.
 *
 * The URI must NOT end in a slash.
 */
export const SOCKET_URI = `ws://${hostName}:8000`;

/**
 * The application name, can be changed and will render a different
 * name for every component that uses it.
 */
export const APP_NAME = 'HTML5 Whirled';

/**
 * Keys used for local storage.
 */
export enum LocalStorage {
  SESSION = 'Session',
}
