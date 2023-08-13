import { App } from "./App/App.ts";
import { IsBrowser } from "@/drivers/BrowserDriver/IsBrowser.ts";
import { multiThreaded } from "./consts.ts";

const start = async () => {
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
export let port: MessagePort;
export const setPort = (p: MessagePort) => {
   // console.log("p", p);
   port = p;
   // eslint-disable-next-line @typescript-eslint/no-floating-promises
   start();
};

if(multiThreaded) {
   // eslint-disable-next-line no-undef
   onmessage = (ev) => {
      switch (ev.data) {
         case "start":
            port = ev.ports[0];
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            start();
            return;
         default:
            throw new Error(`workerThread: onmessage: unknown message: ${ev.data}`);
      }
   };
}
