import { expose } from "comlink";

import { BrowserDriver } from "@/drivers/BrowserDriver/index.ts";
import { multiThreaded } from "./consts.ts";

BrowserDriver.OnLoad(async () => {
   const windowChannel = new MessageChannel();

   expose(window, windowChannel.port1);

   if (multiThreaded) {
      const worker = new Worker(new URL("./workerThread.ts", import.meta.url), {
         type: "module",
      });

      worker.postMessage("start", [windowChannel.port2]);
   } else {
      // if single-threaded, just import the worker normally.
      const { setPort } = (await import("./workerThread.ts"));
      setPort(windowChannel.port2);
   }
});
