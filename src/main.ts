import { App } from "./App/App";
import { BrowserDriver, IsBrowser } from "./drivers/BrowserDriver";

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
