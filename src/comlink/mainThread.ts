/* eslint-disable @typescript-eslint/no-implied-eval */
import { expose } from "comlink";

const channel = new MessageChannel();

const runInMainThread = () => {
   // return Function(functionBody)();
   console.log("hello from main thread");
};

export type TRunInMainThread = typeof runInMainThread;

expose(runInMainThread, channel.port2);

const worker = new Worker(new URL("./webWorker.ts", import.meta.url), {
   type: "module",
});

worker.postMessage(undefined, [channel.port1]);