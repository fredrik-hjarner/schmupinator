import { expose } from "comlink";

import { BrowserDriver } from "@/drivers/BrowserDriver/index.ts";
import { multiThreaded } from "./consts.ts";

BrowserDriver.OnLoad(async () => {
   const windowChannel = new MessageChannel();

   expose(window, windowChannel.port1);

   if (multiThreaded) {
      const worker = new Worker(new URL("./webWorker/workerThread.ts", import.meta.url), {
         name: "webWorker",
         type: "module",
      });

      console.log("worker created");
      console.log("waiting for worker to be ready");

      await new Promise((resolve) => {
         setTimeout(resolve, 1000 * 5); // TODO: should wait for worker to be ready not just wait.
      });

      console.log("worker ready");

      worker.postMessage("start", [windowChannel.port2]);
   } else {
      // if single-threaded, just import the worker normally.
      const { start } = (await import("./webWorker/workerThread.ts"));
      await start(windowChannel.port2);
   }
});
