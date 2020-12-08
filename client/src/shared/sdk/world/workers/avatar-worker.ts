/**
 * An example of importing a script in a web-worker.
 */
self.importScripts('https://greggman.github.io/doodles/test/ping-worker.js');

const ctx: Worker = self as any;

export const terminateWorker = async () => ctx.terminate();
