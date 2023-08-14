/* eslint-disable @typescript-eslint/no-implied-eval */
import { expose } from "comlink";

/**
 * runInMainThread
 */

const runInMainThreadChannel = new MessageChannel();
const runInMainThread = (functionBody: string): unknown => {
   return Function(functionBody)();
};
export type TRunInMainThread = typeof runInMainThread;
expose(runInMainThread, runInMainThreadChannel.port1);

/**
 * localStorage
 */

const windowChannel = new MessageChannel();
expose(window, windowChannel.port1);

const worker = new Worker(new URL("./webWorker.ts", import.meta.url), {
   type: "module",
});

worker.postMessage({
   runInMainThreadPort: runInMainThreadChannel.port2,
   windowPort: windowChannel.port2,
}, [
   runInMainThreadChannel.port2,
   windowChannel.port2,
]);