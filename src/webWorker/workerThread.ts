import { App } from "../App/App.ts";
import { IsBrowser } from "@/drivers/BrowserDriver/IsBrowser.ts";
import { multiThreaded } from "../consts.ts";
import { remoteWindow } from "./remoteWindow.ts";

/**
 * TODO: More elaborate comment.
 * port is the MessagePort used to communicate with the WebWorker.
 * When single-threaded the setPort function is used to set the port.
 */

export const start = async (port: MessagePort) => {
   console.log("workerThread: start");
   remoteWindow.set(port);

   // Create app
   const app = await App.create();
   await app.Init();

   // Start
   // console.log("Start");
   if(!IsBrowser()) {
      app.gameLoop.Start();
   }
};

if(multiThreaded) {
   console.log("workerThread: multi-threaded");

   // eslint-disable-next-line no-undef
   onmessage = (ev) => {
      console.log("workerThread: onmessage");
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
