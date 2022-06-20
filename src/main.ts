import { App } from "./App/App";
import { BrowserDriver } from "./drivers/BrowserDriver";

BrowserDriver.OnLoad(async () => {
   // Create app
   const app = new App();
   await app.Init();

   // Start
   console.log("Start");
   app.gameLoop.Start();
   console.log("Finished!");
});
