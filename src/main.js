import { App } from './App.js';
import { initGameDiv } from './gameDiv.js';
import { Shot } from './shot/shot.js';


initGameDiv();

window.onload = () => {
  // Create app
  const app = new App();

  // Init
  app.player.Init();

  // Start
  console.log("Start");
  app.gameLoop.Start();

  const shots: Shot[] = [];

  setInterval(() => {
    const shot = new Shot(app, {x: 20, y: 20, spdX: 1, spdY: 1 });
    shots.push(shot);
  }, 3000);
};
