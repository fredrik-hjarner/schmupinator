import type { Requests } from "./Threading/types.ts";

import { BrowserDriver } from "@/drivers/BrowserDriver/index.ts";
import { LocalStorage_MainThread } from "./Threading/LocalStorage/LocalStorage_MainThread.ts";

BrowserDriver.OnLoad(() => {
   // const channel = new MessageChannel();

   const worker = new Worker(new URL("./workerThread.ts", import.meta.url), {
      type: "module",
   });

   const localStorage_MainThread = new LocalStorage_MainThread(worker);

   worker.onmessage = (ev) => {
      const data = ev.data as Requests;
      console.log("worker.onmessage: data", data);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      switch (data.type) {
         case "getItemRequest":
            // eslint-disable-next-line
            localStorage_MainThread.getItem(data)
            return;
         case "setItemRequest":
            // eslint-disable-next-line
            localStorage_MainThread.setItem(data)
            return;
         default:
            // @ts-ignore: Unreachable code error
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            throw new Error(`UiThread: onmessage: Unknown message type: ${data.type}`);
      }
   };

   worker.postMessage("start");
});
