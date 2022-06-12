import { App } from './App/App';

window.onload = async () => {
   // Create app
   const app = new App();
   await app.Init();

   // Start
   console.log("Start");
   app.gameLoop.Start();
};
