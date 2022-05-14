import { initGameDiv } from './gameDiv.js';
import { GameLoop } from './gameLoop.js';
import { Input } from './input.js';
import { Player } from './player/player.js';

initGameDiv();

window.onload = () => {
  // Create app
  const application = (() => {
    // add dependencies on app
    const app = {};
    app.input = new Input(app);
    app.gameLoop = new GameLoop(app);
    app.player = new Player(app);
    return app;
  })();

  // Init
  application.player.Init();

  // Start
  console.log("Start");
  application.gameLoop.Start();
};
