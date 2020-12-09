/**
 * A proxy function that loads a JavaScript file. If the file has been loaded,
 * this function will return true. Else, it will throw an exception that the
 * file failed to load.
 *
 * This function is useful if you're trying to load user generated JavaScript files
 * through a different domain or port (cross origin). This is because Web Workers
 * prevent you from loading scripts outside of the same origin, so if you call this
 * function in a worker from the same origin, then that worker can load the cross origin script.
 *
 * This function will still work even if the requested script is from the same origin.
 *
 * @param script The URL to the script.
 */
export const loadCrossOriginScript = async (script: string) => {
  self.importScripts(script);
  return true;
};
