import { App } from "./App/App.ts";
import { BrowserDriver } from "@/drivers/BrowserDriver/index.ts";
import { IsBrowser } from "@/drivers/BrowserDriver/IsBrowser.ts";

BrowserDriver.OnLoad(async () => {
   // Create app
   const app = new App();
   await app.Init();

   // Start
   // console.log("Start");
   if(!IsBrowser()) {
      // If not running in a browser it means it runs headless in either node or deno
      // which means that we are running e2e tests which is why we start the game loop immediately.
      app.gameLoop.Start();
   }
});
