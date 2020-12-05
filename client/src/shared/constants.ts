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
 * Salt used to send passwords from the client to the server.
 *
 * Note that this is still not secure since the user can view the
 * salt in the client-side, so that's why we perform more security
 * measurements in the server-side before storing the password.
 */
export const Salt = 'IMoZ1t4Okte2';

/**
 * Keys used for local storage.
 */
export enum LocalStorage {
  Session = 'Session',
}
