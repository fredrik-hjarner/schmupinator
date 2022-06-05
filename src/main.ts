import { App } from './App/App';

window.onload = () => {
   // Create app
   const app = new App();

   // Start
   console.log("Start");
   app.gameLoop.Start();
};
