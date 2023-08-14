/* eslint-disable @typescript-eslint/no-implied-eval */
import { expose } from "comlink";

/**
 * expose whole window object
 */

const windowChannel = new MessageChannel();
expose(window, windowChannel.port1);

const worker = new Worker(new URL("./webWorker.ts", import.meta.url), {
   type: "module",
});

worker.postMessage({
   windowPort: windowChannel.port2,
}, [
   windowChannel.port2,
]);