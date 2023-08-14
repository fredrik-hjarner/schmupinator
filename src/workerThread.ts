import { wrap } from "comlink";

import { App } from "./App/App.ts";
import { IsBrowser } from "@/drivers/BrowserDriver/IsBrowser.ts";
import { multiThreaded } from "./consts.ts";

/**
 * TODO: More elaborate comment.
 * port is the MessagePort used to communicate with the WebWorker.
 * When single-threaded the setPort function is used to set the port.
 */
export let remoteWindow: Window;

const start = async (port: MessagePort) => {
   remoteWindow = wrap<Window>(port);

   // Create app
   const app = await App.create();
   await app.Init();

   // Start
   // console.log("Start");
   if(!IsBrowser()) {
      app.gameLoop.Start();
   }
};

/**
 * TODO: More elaborate comment.
 * port is the MessagePort used to communicate with the WebWorker.
 * When single-threaded the setPort function is used to set the port.
 */
export const setPort = (port: MessagePort) => {
   // eslint-disable-next-line @typescript-eslint/no-floating-promises
   start(port);
};

if(multiThreaded) {
   // eslint-disable-next-line no-undef
   onmessage = (ev) => {
      switch (ev.data) {
         case "start":
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            start(ev.ports[0]);
            return;
         default:
            throw new Error(`workerThread: onmessage: unknown message: ${ev.data}`);
      }
   };
}
