import { App } from './App/App';
import { initGameDiv } from './gameDiv';

initGameDiv();

window.onload = () => {
  // Create app
  const app = new App();

  // Init
  // TODO: Move the Inits into app.
  app.player.Init();
  app.playerShots.Init();
  app.enemyShots.Init();
  app.enemies.Init();
  app.collisions.Init();

  // Start
  console.log("Start");
  app.gameLoop.Start();
};
