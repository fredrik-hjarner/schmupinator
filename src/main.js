import { playerSpeedPerFrame } from './consts.js';
import { initGameDiv } from './gameDiv.js';
import { GameLoop } from './gameLoop.js';
import { Input } from './input.js';

/**
 * Variables
 */
const input = new Input();
let player = { position: { x: 100, y: 100 }, radius: 20 };
initGameDiv();

/**
 * Functions
 */
const initPlayerDiv = () => {
  const playerDiv = window.document.querySelector("#player")
  playerDiv.style.position = "fixed";
  playerDiv.style.backgroundColor = "blue";
  playerDiv.style.width = `${player.radius}px`;
  playerDiv.style.height = `${player.radius}px`;
  playerDiv.style.top = `${player.position.y}px`;
  playerDiv.style.left = `${player.position.x}px`;
  playerDiv.style.borderRadius = "5000px";
  return playerDiv;
}
const playerDiv = initPlayerDiv()

const updatePlayer = () => {
  const speed = playerSpeedPerFrame[0];

  if (input.buttonsPressed.left) {
    player.position.x -= speed;
  }
  if (input.buttonsPressed.right) {
    player.position.x += speed;
  }
  if (input.buttonsPressed.up) {
    player.position.y -= speed;
  }
  if (input.buttonsPressed.down) {
    player.position.y += speed;
  }

  playerDiv.style.top = `${player.position.y}px`;
  playerDiv.style.left = `${player.position.x}px`;
}

window.onload = () => {
  const application = (() => {
    // app contains all initialized shit.
    const app = {};
    app.input = input;
    app.gameLoop = new GameLoop(app);
    return app;
  })();

  application.gameLoop.SubscribeToNextFrame("updatePlayer", updatePlayer);

  console.log("Start");
  application.gameLoop.Start();
};
