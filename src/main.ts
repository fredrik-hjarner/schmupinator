import type { Requests } from "./Threading/types.ts";

import { BrowserDriver } from "@/drivers/BrowserDriver/index.ts";
import { LocalStorage_MainThread } from "./Threading/LocalStorage/LocalStorage_MainThread.ts";
import { multiThreaded } from "./consts.ts";

BrowserDriver.OnLoad(async () => {
   const channel = new MessageChannel();
   
   const localStorage_MainThread = new LocalStorage_MainThread(channel.port1);

   channel.port1.onmessage = (ev) => {
      const data = ev.data as Requests;
      console.log("worker.onmessage: data", data);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      switch (data.type) {
         case "getItemRequest":
            localStorage_MainThread.getItem(data);
            return;
         case "setItemRequest":
            localStorage_MainThread.setItem(data);
            return;
         default:
            // @ts-ignore: Unreachable code error
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            throw new Error(`UiThread: onmessage: Unknown message type: ${data.type}`);
      }
   };

   if (multiThreaded) {
      const worker = new Worker(new URL("./workerThread.ts", import.meta.url), {
         type: "module",
      });

      worker.postMessage("start", [channel.port2]);
   } else {
      // if single-threaded, just import the worker normally.
      const { setPort } = (await import("./workerThread.ts"));
      setPort(channel.port2);
   }
});
