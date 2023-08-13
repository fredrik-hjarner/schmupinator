import { App } from "./App/App.ts";
import { IsBrowser } from "@/drivers/BrowserDriver/IsBrowser.ts";

await new Promise(resolve => {
   // eslint-disable-next-line no-undef
   onmessage = (ev) => {
      switch (ev.data) {
         case "start":
            resolve(undefined);
            return;
         default:
            throw new Error(`workerThread: onmessage: unknown message: ${ev.data}`);
      }
   };
});

// Create app
const app = new App();
await app.Init();

// Start
// console.log("Start");
if(!IsBrowser()) {
   app.gameLoop.Start();
}

