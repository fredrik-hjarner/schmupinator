import { App } from './App.js';
import { initGameDiv } from './gameDiv.js';

initGameDiv();

window.onload = () => {
  // Create app
  const app = new App();

  // Init
  app.player.Init();
  app.shots.Init();

  // Start
  console.log("Start");
  app.gameLoop.Start();
};
