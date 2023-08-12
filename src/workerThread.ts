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
      app.gameLoop.Start();
   }
});
